import { ComponentModule } from "../../../src/modules/component.js";
import "./../ollama-models/ollama-models.js";

export class OllamaSettings extends HTMLElement {
	static name = Object.freeze("ollama-settings");

	#clickHandler = this.#click.bind(this);

	constructor() {
		super();
		this.attachShadow({ mode: "open" });
	}

	async connectedCallback() {
		this.shadowRoot.innerHTML = await ComponentModule.load_html({
			url: import.meta.url,
		});

		this.addEventListener("click", this.#clickHandler);
	}

	async disconnectedCallback() {
		this.removeEventListener("click", this.#clickHandler);
	}

	#click(event) {
		const target = event.composedPath()[0];

		if (target.dataset.action != null) {
			this[target.dataset.action](event);
		}
	}

	closeDialog() {
		this.remove();
	}

	models() {
		document.body.appendChild(document.createElement("ollama-models"));
	}
}

customElements.define(OllamaSettings.name, OllamaSettings);
