import { ComponentModule } from "../../../src/modules/component.js";
import "./../ollama-models/ollama-models.js";
import {OllamaModule} from "../../../src/modules/ollama.js";

const LocalStorageKeys = Object.freeze({
	CHAT_MODEL: "chatModel",
	GENERATE_MODEL: "generateModel",
	EMBEDDING_MODEL: "embeddingModel",
});

export class OllamaSettings extends HTMLElement {
	static name = Object.freeze("ollama-settings");

	#clickHandler = this.#click.bind(this);
	#changeHandler = this.#change.bind(this);

	constructor() {
		super();
		this.attachShadow({ mode: "open" });
	}

	async connectedCallback() {
		this.shadowRoot.innerHTML = await ComponentModule.load_html({
			url: import.meta.url,
		});

		this.shadowRoot.addEventListener("click", this.#clickHandler);
		this.shadowRoot.addEventListener("change", this.#changeHandler);

		const installedModels = await OllamaModule.get_installed_models();
		const listItemElements = createListItemElements(installedModels);

		const cbChat = this.shadowRoot.querySelector("#cbChat");
		cbChat.appendChild(listItemElements.cloneNode(true));
		cbChat.value = localStorage.getItem(LocalStorageKeys.CHAT_MODEL) ?? "none";

		const cbGenerate = this.shadowRoot.querySelector("#cbGenerate");
		cbGenerate.appendChild(listItemElements.cloneNode(true));
		cbGenerate.value = localStorage.getItem(LocalStorageKeys.GENERATE_MODEL) ?? "none";

		const cbEmbedding = this.shadowRoot.querySelector("#cbEmbedding");
		cbEmbedding.appendChild(listItemElements.cloneNode(true));
		cbEmbedding.value = localStorage.getItem(LocalStorageKeys.EMBEDDING_MODEL) ?? "none";
	}

	async disconnectedCallback() {
		this.shadowRoot.removeEventListener("click", this.#clickHandler);
		this.shadowRoot.removeEventListener("change", this.#changeHandler);
	}

	#click(event) {
		const target = event.composedPath()[0];

		if (target.dataset.action != null) {
			this[target.dataset.action](event);
		}
	}

	#change(event) {
		const target = event.composedPath()[0];
		const store = target.dataset.store;
		const value = target.value;
		localStorage.setItem(store, value);
	}

	closeDialog() {
		this.remove();
	}

	models() {
		document.body.appendChild(document.createElement("ollama-models"));
	}
}

function createListItemElements(models) {
	const fragment = document.createDocumentFragment();
	for (const model of models) {
		const optionElement = document.createElement("option");
		optionElement.textContent = model;
		optionElement.value = model;
		fragment.appendChild(optionElement);
	}
	return fragment;
}

customElements.define(OllamaSettings.name, OllamaSettings);
