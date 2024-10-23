import {ComponentModule} from '../../src/modules/component.js';

const TRANSLATION_MAP = {
    "placeholder": "input:placeholder",
    "run-hint": "#btnRun:title",
    "attach-hint": "#btnAttach:title",
    "settings-hint": "#btnSettings:title"
}

export class OllamaUIComponent extends HTMLElement {
    static name = Object.freeze('ollama-ui');

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
    }

    async disconnectedCallback() {

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

function setTranslations(shadowRoot, translations) {
    for (const key of Object.keys(translations)) {
        if (TRANSLATION_MAP[key]) {
            const parts = TRANSLATION_MAP[key].split(':');
            shadowRoot.querySelector(`${parts[0]}`).setAttribute(parts[1], dictionary[key]);
        }
    }
}

customElements.define(OllamaUIComponent.name, OllamaUIComponent);