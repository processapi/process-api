import {ComponentModule} from '../../src/modules/component.js';
import {OllamaSettings} from "./ollama-settings.js";

const TRANSLATION_MAP = {
    "placeholder": "input:placeholder",
    "run-hint": "#btnRun:title",
    "attach-hint": "#btnAttach:title",
    "settings-hint": "#btnSettings:title"
}

export class OllamaUIComponent extends HTMLElement {
    static name = Object.freeze('ollama-ui');

    #btnAttachClickHandler = this.#btnAttachClick.bind(this);
    #btnRunClickHandler = this.#btnRunClick.bind(this);
    #btnSettingsClickHandler = this.#btnSettingsClick.bind(this);

    #options = {
        model: "llama3.2",
        embeddingsModel: "mxbai-embed-large"
    };

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback(){
        this.shadowRoot.innerHTML = await ComponentModule.load_html({ url: import.meta.url });
        manageClickEvents(this.shadowRoot, "addEventListener", this.#btnAttachClickHandler, this.#btnRunClickHandler, this.#btnSettingsClickHandler);
    }

    async disconnectedCallback() {
        manageClickEvents(this.shadowRoot, "removeEventListener", this.#btnAttachClickHandler, this.#btnRunClickHandler, this.#btnSettingsClickHandler);

        this.#btnAttachClickHandler = null;
        this.#btnRunClickHandler = null;
        this.#btnSettingsClickHandler = null;
    }

    #btnAttachClick() {
        console.log("Attach clicked");
    }

    #btnRunClick() {
        console.log("Run clicked");
    }

    #btnSettingsClick() {
        OllamaSettings.showDialog();
    }

    /**
     * Sets the translations for the component
     * {
     *     "placeholder"    : "Enter your text here",
     *     "run-hint"       : "Run",
     *     "attach-hint"    : "Attach a file",
     *     "settings-hint"  : "Settings"
     * }
     * @param options {Object} - Define options for the component such as model to use, translations etc.
     * @returns {void}
     */
    setOptions(options) {
        this.#options = options;

        if (options.translations != null) {
            setTranslations(this.shadowRoot, options.translations);
        }
    }
}

function manageClickEvents(shadowRoot, action, attachHandler, runHandler, settingsHandler) {
    shadowRoot.querySelector("#btnAttach")[action]("click", attachHandler);
    shadowRoot.querySelector("#btnRun")[action]("click", runHandler);
    shadowRoot.querySelector("#btnSettings")[action]("click", settingsHandler);
}

function setTranslations(shadowRoot, translations) {
    for (const key of Object.keys(translations)) {
        if (TRANSLATION_MAP[key]) {
            const parts = TRANSLATION_MAP[key].split(':');
            shadowRoot.querySelector(`${parts[0]}`).setAttribute(parts[1], dictionary[key]);
        }
    }
}

customElements.define(OllamaUIComponent.name, OllamaUIComponent);