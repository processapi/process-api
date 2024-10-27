import { ComponentModule } from "../../src/modules/component.js";
import { OllamaModule } from "../../src/modules/ollama.js";

export class OllamaModels extends HTMLElement {
    static name = Object.freeze("ollama-models");
    #models;
    #installed;
    #selectedHandler = this.#selected.bind(this);

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

        buildListItems(this.shadowRoot, this.#models, this.#installed);

        this.#selectFirstModel();
    }

    async disconnectedCallback() {
        this.shadowRoot.querySelector(".available").removeEventListener("click", this.#selectedHandler);
        this.#selectedHandler = null;
        this.#models = null;
    }

    #selectFirstModel() {
        this.shadowRoot.querySelector(".available").addEventListener("click", this.#selectedHandler);
        const parentElement = this.shadowRoot.querySelector(".model");
        updateSelected(this.shadowRoot, parentElement, this.#models[Object.keys(this.#models)[0]]);
    }

    async #selected(event) {
        const target = event.composedPath()[0];
        const modelName = target.querySelector(".model-name").textContent.trim();
        const model = structuredClone(this.#models[modelName]);
        model.name = modelName;
        const parentElement = this.shadowRoot.querySelector(".model");
        updateSelected(this.shadowRoot, parentElement, model);
    }
}

function buildListItems(shadowRoot, models, installed) {
    const template = shadowRoot.querySelector("#models-template");
    const parentElement = shadowRoot.querySelector(".available");

    for (const modelName of Object.keys(models)) {
        const listItem = template.content.cloneNode(true);
        listItem.querySelector(".model-name").textContent = modelName;
        listItem.querySelector(".model-size").textContent = models[modelName].sizes["latest"];

        const installedElement = listItem.querySelector(".installed");
        if (installed.includes(modelName)) {
            installedElement.classList.add("installed");
        }

        parentElement.appendChild(listItem);
    }
}

function updateSelected(shadowRoot, parentElement, item) {
    parentElement.querySelector(".model-name").textContent = item.name;

    const urlElement = parentElement.querySelector(".url");
    urlElement.setAttribute("href", item.url);
    urlElement.textContent = item.url;

    const toolsElement = parentElement.querySelector(".tools");
    toolsElement.textContent = `Tools: ${item.tools}`;
    toolsElement.dataset.tools = item.tools;

    const sizesElement = parentElement.querySelector(".sizes");
    createSizes(sizesElement, shadowRoot, item.sizes);
}

function createSizes(parentElement, shadowRoot, sizes) {
    const template = shadowRoot.querySelector("#sizes-template");
    parentElement.innerHTML = "";

    for (const size of Object.keys(sizes)) {
        const clone = template.content.cloneNode(true);
        clone.querySelector(".size-name").textContent = size;
        clone.querySelector(".size-value").textContent = sizes[size];
        parentElement.appendChild(clone);
    }
}

customElements.define(OllamaModels.name, OllamaModels);
