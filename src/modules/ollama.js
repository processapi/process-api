const DEFAULT_URL = "http://127.0.0.1:11434";
const CHAT_URL = `${DEFAULT_URL}/api/chat`;
const GENERATE_URL = `${DEFAULT_URL}/api/generate`;
const MODELS_URL = `${DEFAULT_URL}/api/tags`;
const DELETE_URL = `${DEFAULT_URL}/api/delete`;
const INSTALL_URL = `${DEFAULT_URL}/api/pull`;

const GENERATE_OPTIONAL_ARGS = Object.freeze(["suffix", "images", "format", "options", "system", "template", "context", "stream", "raw", "keep_alive"]);

export const ChatRoles = Object.freeze({
    USER: "user",
    ASSISTANT: "assistant",
    SYSTEM: "system"
})

export class OllamaModule {
    static name = Object.freeze('ollama');

    static async create_message(args) {
        return {
            role: args.role ?? ChatRoles.USER,
            content: args.text
        }
    }

    static async* generate(args) {
        const body = {
            model: args.model,
            prompt: args.prompt
        }

        for (const key in GENERATE_OPTIONAL_ARGS) {
            if (key in args) {
                body[key] = args[key];
            }
        }

        const response = await fetch(GENERATE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: args.model,
                prompt: args.prompt,
                stream: args.stream ?? true
            })
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                yield decoder.decode(value, {stream: true});
            }
        }
        finally {
            reader.releaseLock();
        }
    }

    static async* chat(args) {
        const response = await fetch(CHAT_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: args.model,
                messages: args.messages,
                stream: args.stream ?? true
            })
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                yield decoder.decode(value, {stream: true});
            }
        }
        finally {
            reader.releaseLock();
        }
    }

    static async get_installed_models() {
        const result = await fetch(MODELS_URL).then(response => response.json());
        const models = result.models.map(model => model.name.split(":latest")[0]);
        return models;
    }

    static async delete_model(args) {
        const result = fetch(DELETE_URL, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: args.name
            })
        })

        return result;
    }

    static async* install_model(args) {
        const response = await fetch(INSTALL_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: args.name,
                stream: true
            })
        })

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                yield decoder.decode(value, {stream: true});
            }
        }
        finally {
            reader.releaseLock();
        }
    }
}