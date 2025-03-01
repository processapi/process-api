import {OllamaModule} from "./../../src/modules/ollama.js";

const tools = [
	{
		"type": "function",
		"function": {
			"name": "example_function",
			"description": "This is an example function",
			"parameters": [
				{
					"type": "object",
					"properties": {
						"option": {
							"type": "string",
							"description": "The value to return",
							"enum": ["option1", "option2"]
						}
					}
				}
			],
		}
	}
]

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

	callFunction(event) {
		alert("click")
	}
}

customElements.define(OllamaToolsView.tag, OllamaToolsView);
