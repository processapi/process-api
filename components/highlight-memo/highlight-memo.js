import {ComponentModule} from "../../src/modules/component.js";

export class HighlightMemo extends HTMLElement {
    static name = Object.freeze("highlight-memo");

    #row = [];

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    async connectedCallback() {
        this.shadowRoot.innerHTML = await ComponentModule.load_html({
            url: import.meta.url,
        });
    }

    async disconnectedCallback() {
    }

    push(word) {
        if (word.trim().length === 0) {

        }

        this.#row.push(word);
    }
}

customElements.define(HighlightMemo.name, HighlightMemo);