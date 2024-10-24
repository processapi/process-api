import { ComponentModule } from "../../src/modules/component.js";

export class OllamaSettings extends HTMLElement {
	static name = Object.freeze("ollama-settings");

	#btnCloseClickHandler = this.#btnCloseClick.bind(this);

	constructor() {
		super();
		this.attachShadow({ mode: "open" });
	}

	async connectedCallback() {
		this.shadowRoot.innerHTML = await ComponentModule.load_html({
			url: import.meta.url,
		});
		this.shadowRoot.querySelector("#btnClose").addEventListener(
			"click",
			this.#btnCloseClickHandler,
		);
	}

	async disconnectedCallback() {
		this.shadowRoot.querySelector("#btnClose").removeEventListener(
			"click",
			this.#btnCloseClickHandler,
		);
		this.#btnCloseClickHandler = null;
	}

	static showDialog() {
		const dialog = document.createElement("dialog");
		const instance = document.createElement(this.name);
		instance.dialog = dialog;

		dialog.appendChild(instance);
		document.body.appendChild(dialog);
		dialog.showModal();
	}

	#btnCloseClick() {
		const dialog = this.dialog;
		dialog.close();
		dialog.remove();

		delete this.dialog;
	}
}

customElements.define(OllamaSettings.name, OllamaSettings);
