import { ComponentModule } from "../../src/modules/component.js";
import { OllamaModule } from "../../src/modules/ollama.js";

export class OllamaSettings extends HTMLElement {
	static name = Object.freeze("ollama-settings");

	constructor() {
		super();
		this.attachShadow({ mode: "open" });
	}

	async connectedCallback() {
		this.shadowRoot.innerHTML = await ComponentModule.load_html({
			url: import.meta.url,
		});

	}

	async disconnectedCallback() {
	}
}

customElements.define(OllamaSettings.name, OllamaSettings);
