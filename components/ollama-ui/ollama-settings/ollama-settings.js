import { ComponentModule } from "../../../src/modules/component.js";
import "./../ollama-models/ollama-models.js";
import {OllamaModule} from "../../../src/modules/ollama.js";

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
		const installedModels = await OllamaModule.get_installed_models();
		const listItemElements = createListItemElements(installedModels);

		this.shadowRoot.querySelector("#cbChat").appendChild(listItemElements.cloneNode(true));
		this.shadowRoot.querySelector("#cbGenerate").appendChild(listItemElements.cloneNode(true));
		this.shadowRoot.querySelector("#cbEmbedding").appendChild(listItemElements.cloneNode(true));
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
