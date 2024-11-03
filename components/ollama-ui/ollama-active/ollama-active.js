import {ComponentModule} from "../../../src/modules/component.js";

export class OllamaActive extends HTMLElement {
    static name = Object.freeze("ollama-active");

    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    async connectedCallback() {
        this.shadowRoot.innerHTML = await ComponentModule.load_html({
            url: import.meta.url,
        });
    }
}

customElements.define("ollama-active", OllamaActive);