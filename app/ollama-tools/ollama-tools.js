import {OllamaModule, ChatRoles} from "./../../src/modules/ollama.js";
import "./../../components/monaco-editor/monaco-editor.js";
import "./../../components/dynamic-columns/dynamic-columns.js";
import "./../../components/dynamic-rows/dynamic-rows.js";

export default class OllamaToolsView extends HTMLElement {
	static tag = "ollama-tools-view";

	#onClickHandler = this.#onClick.bind(this);

	constructor() {
		super();
		this.attachShadow({ mode: "open" });
	}

	async connectedCallback() {
		this.shadowRoot.innerHTML = await api.call("component", "load_html", {
			url: import.meta.url,
		});

		this.addEventListener("click", this.#onClickHandler);
	}

	async disconnectedCallback() {
		this.removeEventListener("click", this.#onClickHandler);
	}

	#onClick(event) {
		const target = event.composedPath()[0];
		if (target.dataset.action != null) {
			this[target.dataset.action].call(this, event);
		}
	}

	async callFunction(event) {
		const result = [];

		const message = await OllamaModule.create_message({
			text: "Do you know how old the person is?"
		});

		const tools = JSON.parse(this.shadowRoot.querySelector("#tools").value);

		const callResult = await OllamaModule.chat({
			"model": "llama3.2",
			"tools": tools,
			"messages": [ message ], 
			"stream": false
		})

		for await (const data of callResult) {
			result.push(data);
		}

		const toolsJson = JSON.parse(result[0]);
		const functionDefinition = toolsJson.message.tool_calls[0];
		const functionName = functionDefinition.function.name;
		const functionArgs = functionDefinition.function.arguments;

		const functionCallMessage = await OllamaModule.create_message({
			role: ChatRoles.TOOL,
			text: `22`
		});

		const finalResult = await OllamaModule.chat({
			"model": "llama3.2",
			"tools": tools,
			"messages": [ message, functionCallMessage ],
			"stream": false
		});

		result.length = 0;

		for await (const data of finalResult) {
			result.push(data);
		}

		this.shadowRoot.querySelector("text-area").textContent = JSON.parse(result[0]).message.content;
	}
}

customElements.define(OllamaToolsView.tag, OllamaToolsView);
