import { ComponentModule } from "../../src/modules/component.js";
import { OllamaModule } from "../../src/modules/ollama.js";

export class OllamaModels extends HTMLElement {
    static name = Object.freeze("ollama-models");
    #models;

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
        buildListItems(this.shadowRoot.querySelector(".available"), this.#models);
    }

    async disconnectedCallback() {
        this.#models = null;
    }
}

function buildListItems(parent, models) {
    for (const modelName of Object.keys(models)) {
        const listItem = document.createElement("li");
        listItem.textContent = modelName;
        parent.appendChild(listItem);
    }
}

customElements.define(OllamaModels.name, OllamaModels);
