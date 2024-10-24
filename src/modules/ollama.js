// deno-lint-ignore-file require-await

const DEFAULT_URL   = "http://127.0.0.1:11434";
const CHAT          = "chat";
const GENERATE      = "generate";
const MODELS        = "tags";
const DELETE        = "delete";
const INSTALL       = "pull";
const POST          = "post";

const GENERATE_OPTIONAL_ARGS = Object.freeze(["suffix", "images", "format", "options", "system", "template", "context", "stream", "raw", "keep_alive"]);
const CHAT_OPTIONAL_ARGS = Object.freeze(["tools", "role", "content", "images", "tool_calls", "format", "options", "system", "template", "context", "stream", "keep_alive"]);

export const ChatRoles = Object.freeze({
    USER: "user",
    ASSISTANT: "assistant",
    SYSTEM: "system"
})

export class OllamaModule {
    static name = Object.freeze('ollama');

    /**
     * @method create_message
     * @description Create a message to send to the server, this is a simple factory that creates a message object
     * @param args {Object} - The arguments for the method
     * @param args.text {string} - The text of the message
     * @param args.role {ChatRoles} - The role of the message, defaults to ChatRoles.USER
     * @returns {Promise<{role: (*|string), content}>}
     */
    static async create_message(args) {
        return {
            role: args.role ?? ChatRoles.USER,
            content: args.text
        }
    }

    /**
     * @method generate
     * @description Tell llama to generate text based on the given prompt
     * This method will stream the response back to the caller
     * The conversation is not tracked, so the response will be based on the prompt only
     * @param args {Object} - The arguments for the method
     * @param args.model {string} - The model to use for generation
     * @param args.prompt {string} - The prompt to use for generation
     * @param args.stream {boolean} - Whether to stream the response or not, defaults to true
     * @param args.url {string} - The URL to use for the request, defaults to localhost
     * @returns {AsyncGenerator<string, void, unknown>}
     */
    static async* generate(args) {
        const url = createUrl(args, GENERATE);

        const body = decorateBody({
            model: args.model,
            prompt: args.prompt,
            stream: args.stream ?? true,
        }, GENERATE_OPTIONAL_ARGS, args);

        yield* processRequest(url, POST, body);
    }

    /**
     * @method chat
     * @description Tell llama to chat with the given messages
     * This method will stream the response back to the caller
     * The messages is an array of messages so that it can remember prior messages in the conversation
     * In the messages array, use objects created with create_message.
     * @param args {Object} - The arguments for the method
     * @param args.model {string} - The model to use for chatting
     * @param args.messages {Array<{role: ChatRoles, content: string}>} - The messages to chat with
     * @param args.stream {boolean} - Whether to stream the response or not, defaults to true
     * @returns {AsyncGenerator<string, void, unknown>}
     */
    static async* chat(args) {
        const url = createUrl(args, CHAT);

        const body = decorateBody({
            model: args.model,
            messages: args.messages,
            stream: args.stream ?? true
        }, CHAT_OPTIONAL_ARGS, args);

        yield* processRequest(url, POST, body);
    }

    /**
     * @method get_installed_models
     * @description Get the list of installed models from llama
     * This method will return a promise that resolves to the list of installed models
     * The list of models is an array of strings
     * @returns {Promise<string[]>}
     */
    static async get_installed_models() {
        const url = createUrl({}, MODELS);
        const result = await fetch(url).then(response => response.json());
        return result.models.map(model => model.name);
    }

    /**
     * @method delete_model
     * @description Tell llama to delete a given model by name
     * @param args
     * @param args.name {string} - The name of the model to delete
     * @returns {Promise<Response>}
     */
    static async delete_model(args) {
        const url = createUrl(args, DELETE);
        return callServer(url, DELETE, {name: args.name});
    }

    /**
     * @method install_model
     * @description Tell llama to install a given model by name.
     * Since the installation can take a long time, this method will stream the response back to the caller
     * @param args {Object} - The arguments for the method
     * @param args.name {string} - The name of the model to install
     * @returns {AsyncGenerator<string, void, unknown>}
     */
    static async* install_model(args) {
        const url = createUrl(args, INSTALL);
        yield* processRequest(url, POST, {
            name: args.name,
            stream: true
        });
    }
}

/**
 * @function createUrl
 * @description Create the URL for the given path
 * @param args {Object} - The args that was passed to the calling method that may contain the URL
 * @param path {string} - The path to append to the URL to create the full URL for example "chat" or "generate"
 * @returns {string}
 */
function createUrl(args, path) {
    const url = args.url ?? DEFAULT_URL;
    delete args.url;
    return `${url}/api/${path}`;
}

/**
 * @function decorateBody
 * @description Decorate the body with the given properties and arguments
 * When calling the server there are additional properties that can be set, this function will set those properties
 * if they are defined on the args.
 * For example, streaming can be set to true or false, if it is not set it will default to true
 * @param body {Object} - The body to decorate
 * @param properties {Readonly<string[]>} - The properties to set
 * @param args {Object} - The arguments that define the properties and values to set
 * @returns {Object} - The decorated body
 */
function decorateBody(body, properties, args) {
    for (const key in properties) {
        if (key in args) {
            body[key] = args[key];
        }
    }

    return body;
}

/**
 * @function callServer
 * @description Call the server with the given URL, method and body
 * @param url {string} - The URL to call
 * @param method {string} - The method to use
 * @param body {Object} - The body to send in fetch
 * @returns {Promise<Response>}
 */
async function callServer(url, method, body) {
    return await fetch(url, {
        method: method.toUpperCase(),
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body ?? {})
    });
}

/**
 * @function processRequest
 * @description Process the request with the given URL, method and body
 * This will call the server and stream the response
 * @param url
 * @param method
 * @param body
 * @returns {AsyncGenerator<string, void, unknown>}
 */
async function* processRequest(url, method, body) {
    const response = await callServer(url, method, body);
    yield* streamResponse(response);
}

/**
 * @function streamResponse
 * @description Stream the response from the server, this in particular is used for streaming the response from the server
 * The response from the fetch is passed to this function, it will stream the response
 * @param response {Response} - The response from the fetch call
 * @returns {AsyncGenerator<string, void, *>}
 */
async function* streamResponse(response) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            yield decoder.decode(value, { stream: true });
        }
    } finally {
        reader.releaseLock();
    }
}