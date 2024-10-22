import {ComponentModule} from '../../src/modules/component.js';

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
}

customElements.define(OllamaUIComponent.name, OllamaUIComponent);