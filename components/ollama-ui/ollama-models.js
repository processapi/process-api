import { ComponentModule } from "../../src/modules/component.js";
import { OllamaModule } from "../../src/modules/ollama.js";

export class OllamaModels extends HTMLElement {
    static name = Object.freeze("ollama-models");
    #models;
    #installed;

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    async connectedCallback() {
        this.shadowRoot.innerHTML = await ComponentModule.load_html({
            url: import.meta.url,
        });

        const url = new URL("./models.json", import.meta.url);
        this.#models = await fetch(url).then(result => result.json());

        this.#installed = await OllamaModule
            .get_installed_models()
            .then(result => result.map(model => model.split(":")[0]));

        buildListItems(this.shadowRoot.querySelector(".available"), this.#models, this.#installed);
    }

    async disconnectedCallback() {
        this.#models = null;
    }
}

function buildListItems(parent, models, installed) {
    for (const modelName of Object.keys(models)) {
        const listItem = document.createElement("li");
        listItem.textContent = modelName;

        if (installed.includes(modelName)) {
            listItem.classList.add("installed");
        }

        parent.appendChild(listItem);
    }
}

customElements.define(OllamaModels.name, OllamaModels);
