import { assert } from "jsr:@std/assert";
import { ChatRoles, OllamaModule } from "./../../../src/modules/ollama.js";

Deno.test("OllamaModule - create_message", async () => {
	let message = await OllamaModule.create_message({ text: "Hello, world!" });
	assert(message.role === "user");
	assert(message.content === "Hello, world!");

	message = await OllamaModule.create_message({
		text: "Hello, world!",
		role: ChatRoles.ASSISTANT,
	});
	assert(message.role === "assistant");
});

Deno.test("OllamaModule - chat", async () => {
	const response = OllamaModule.chat({
		model: "llama3.2",
		messages: [
			{ role: ChatRoles.USER, content: "what is 1 + 1" },
			{ role: ChatRoles.ASSISTANT, content: "." },
		],
	});

	const message = [];
	for await (const chunk of response) {
		const messageObj = JSON.parse(chunk);
		message.push(messageObj.message.content);
	}

	assert(message.length > 0);
});

Deno.test("OllamaModule - generate", async () => {
	const response = OllamaModule.generate({
		model: "llama3.1",
		prompt: "what is 1 + 1",
	});

	const messages = [];
	for await (const chunk of response) {
		const messageObj = JSON.parse(chunk);
		messages.push(messageObj.response);
	}

	assert(messages.length > 0);
});

Deno.test("Ollama - embed", async () => {
	const response = await OllamaModule.embed({
		model: "all-minilm",
		input: "hello world",
	});

	assert(response.embeddings.length > 0);
})