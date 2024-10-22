import {ComponentModule} from '../../src/modules/component.js';

const TRANSLATION_MAP = {
    "placeholder": "input:placeholder",
    "run-hint": "#btnRun:title",
    "attach-hint": "#btnAttach:title",
    "settings-hint": "#btnSettings:title"
}

export class OllamaUIComponent extends HTMLElement {
    static name = Object.freeze('ollama-ui');

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
     * @param dictionary
     */
    setTranslations(dictionary) {
        for (const key of Object.keys(dictionary)) {
            if (TRANSLATION_MAP[key]) {
                const parts = TRANSLATION_MAP[key].split(':');
                this.shadowRoot.querySelector(`${parts[0]}`).setAttribute(parts[1], dictionary[key]);
            }
        }
    }
}

customElements.define(OllamaUIComponent.name, OllamaUIComponent);