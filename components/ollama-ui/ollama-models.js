import { ComponentModule } from "../../src/modules/component.js";
import { OllamaModule } from "../../src/modules/ollama.js";
import { SystemModule } from "../../src/modules/system.js";

/**
 * @class OllamaModels
 * @description Custom element for displaying Ollama models.
 * It displays the models available for installation.
 * It also displays if the model supports tooling and additional information about the model.
 * You can install models and delete models.
 *
 * @example
 * <ollama-models></ollama-models>
 */
export class OllamaModels extends HTMLElement {
    static name = Object.freeze("ollama-models");
    #models;
    #installed;
    #selectedHandler = this.#selected.bind(this);
    #filterChangeHandler = this.#filterChanged.bind(this);
    #modelsList;
    #downloading = false;

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    /**
     * @method connectedCallback
     * @description Lifecycle method called when the element is added to the DOM.
     * @returns {Promise<void>}
     */
    async connectedCallback() {
        this.shadowRoot.innerHTML = await ComponentModule.load_html({
            url: import.meta.url,
        });

        this.#modelsList = this.shadowRoot.querySelector(".available");

        const url = new URL("./models.json", import.meta.url);
        this.#models = await fetch(url).then(result => result.json());

        this.#installed = await OllamaModule
            .get_installed_models();
            //.then(result => result.map(model => model.split(":")[0]));

        buildListItems(this.shadowRoot, this.#models, this.#installed);

        this.#selectFirstModel();

        this.addEventListener("click", this.#selectedHandler);
        this.addEventListener("input", this.#filterChangeHandler);
    }

    /**
     * @method disconnectedCallback
     * @description Lifecycle method called when the element is removed from the DOM.
     * @returns {Promise<void>}
     */
    async disconnectedCallback() {
        this.removeEventListener("click", this.#selectedHandler);
        this.addEventListener("input", this.#filterChangeHandler);
        this.#selectedHandler = null;
        this.#filterChangeHandler = null;
        this.#modelsList = null;
        this.#models = null;
    }

    /**
     * @method #selectFirstModel
     * @description Select the first model in the list.
     * This will display the first model in the list as the selected model details.
     * @returns {void}
     */
    #selectFirstModel() {
        const parentElement = this.shadowRoot.querySelector(".model");
        const firstModelName = Object.keys(this.#models)[0];
        const model = structuredClone(this.#models[firstModelName]);
        model.name = firstModelName;

        updateSelected(this.shadowRoot, parentElement, model, this.#installed);
    }

    /**
     * @method #selected
     * @description Event handler for when a model is selected.
     * When a model is selected, display the model details in the selected model section.
     * @param event
     * @returns {Promise<void>}
     */
    async #selected(event) {
        if (this.#downloading) {
            return;
        }
        
        const target = event.composedPath()[0];

        if (SystemModule.is_mobile()) {        
            const modelElement = this.shadowRoot.querySelector(".model");
            const modelsElement = this.shadowRoot.querySelector(".models");

            if (target.dataset.action === "close") {
                modelElement.style.translate = "100% 0";
                modelsElement.style.translate = "0 0";  
                return;  
            }
            else {
                modelElement.style.translate = "0 0";
                modelsElement.style.translate = "-100% 0";    
            }
        }

        if (target instanceof HTMLLIElement) {
            const modelName = target.querySelector(".model-name").textContent.trim();
            const model = structuredClone(this.#models[modelName]);
            model.name = modelName;
            const parentElement = this.shadowRoot.querySelector(".model");

            updateSelected(this.shadowRoot, parentElement, model, this.#installed);
            return;
        }

        if (target.dataset.action != null) {
            const model = target.dataset.model;
            await this[target.dataset.action](model, target);
        }
    }

    async delete(model, button) {
        await OllamaModule.delete_model({ name: model });
        button.dataset.action = "download";
        button.textContent = "Download";
    }

    async download(model, button) {
        this.#downloading = true;
        const downloadElement = this.shadowRoot.querySelector("#download");
        downloadElement.style.visibility = "visible";
        downloadElement.querySelector(".model-name").textContent = model;
        const statusElement = downloadElement.querySelector(".status");
        const completedElement = downloadElement.querySelector(".completed");
        const totalElement = downloadElement.querySelector(".total");

        const response = OllamaModule.install_model({ name: model });

        for await (const chunk of response) {
            try {
                const json = JSON.parse(chunk);
                const status = json.status;
                const total = json.total ?? 0;
                const completed = json.completed ?? 0;

                requestAnimationFrame(() => {
                    statusElement.textContent = status;
                    completedElement.textContent = (Number(completed) / (1024 ** 3)).toFixed(2);
                    totalElement.textContent = (Number(total) / (1024 ** 3)).toFixed(2);
                })
            }
            catch {}
        }

        downloadElement.style.visibility = "hidden";
        button.dataset.action = "delete";
        button.textContent = "Delete";
        this.#downloading = false;
    }

    async close() {
        const modelElement = this.shadowRoot.querySelector(".model");
        const modelsElement = this.shadowRoot.querySelector(".models");
        modelElement.style.translate = "0 0";
        modelsElement.style.translate = "-100% 0";
    }

    /**
     * @method #filterChanged
     * @description Event handler for when the filter input changes.
     * @param event
     * @returns {Promise<void>}
     */
    async #filterChanged(event) {
        const target = event.composedPath()[0];
        const text = target.value.trim().toLowerCase();
        await ComponentModule.filter_ul({ text, listElement: this.#modelsList });
    }
}

/**
 * @function buildListItems
 * @description Build the list items for the models.
 * Display the model name and the size of the model.
 * If the model is installed, display the installed status.
 * @param shadowRoot - Shadow root of the custom element
 * @param models - Models to display
 * @param installed - Currently installed models
 */
function buildListItems(shadowRoot, models, installed) {
    const template = shadowRoot.querySelector("#models-template");
    const parentElement = shadowRoot.querySelector(".available");

    for (const modelName of Object.keys(models)) {
        const listItem = template.content.cloneNode(true);
        listItem.querySelector(".model-name").textContent = modelName;
        listItem.querySelector(".model-size").textContent = models[modelName].sizes["latest"];

        const installedElement = listItem.querySelector(".installed");

        // filter the installed models to find a model that starts with the model name followed by ":"
        const installedModel = installed.find(model => model.startsWith(`${modelName}:`));

        if (installedModel != null) {
            installedElement.dataset.installed = true;
        }

        parentElement.appendChild(listItem);
    }
}

/**
 * @function updateSelected
 * @description Update the selected model details.
 * Display the model name, URL, tools, and sizes of the model.
 * @param shadowRoot - Shadow root of the custom element
 * @param parentElement - Parent element to display the model details
 * @param item - Model details to display
 * @param installed - Currently installed models
 */
function updateSelected(shadowRoot, parentElement, item, installed) {
    parentElement.querySelector(".model-name").textContent = item.name;

    const urlElement = parentElement.querySelector(".url");
    urlElement.setAttribute("href", item.url);
    urlElement.textContent = item.url;

    const toolsElement = parentElement.querySelector(".tools");
    toolsElement.textContent = `Supports Tools: ${item.tools}`;
    toolsElement.dataset.tools = item.tools;

    const sizesElement = parentElement.querySelector(".sizes");
    createSizes(sizesElement, shadowRoot, item.sizes, item.name, installed);
}

/**
 * @function createSizes
 * @description Create the sizes for the model.
 * Display the size name and the size value.
 * @param parentElement - Parent element to display the sizes
 * @param shadowRoot - Shadow root of the custom element
 * @param sizes - Sizes to display
 * @param modelName - Name of the model
 * @param installed - Currently installed models
 */
function createSizes(parentElement, shadowRoot, sizes, modelName, installed) {
    const template = shadowRoot.querySelector("#sizes-template");
    parentElement.innerHTML = "";

    for (const size of Object.keys(sizes)) {
        const clone = template.content.cloneNode(true);
        clone.querySelector(".size-name").textContent = size;
        clone.querySelector(".size-value").textContent = sizes[size];

        const compareName = `${modelName}:${size}`;

        const button = clone.querySelector("button");
        button.dataset.model = compareName;

        if (installed.includes(compareName)) {
            button.textContent = "Delete";
            button.dataset.action = "delete";
        }

        parentElement.appendChild(clone);
    }
}

customElements.define(OllamaModels.name, OllamaModels);
