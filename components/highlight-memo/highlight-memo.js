import {ComponentModule} from "../../src/modules/component.js";
import {MarkdownModule} from "../../src/modules/markdown.js";

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
        this.#row = null;
    }

    push(word) {
        return new Promise(async resolve => {
            if (word.trim().length === 0) {
                const html = await MarkdownModule.to_html({
                    markdown: this.#row.join(""),
                });

                const template = document.createElement("template");
                template.innerHTML = html;
                this.shadowRoot.appendChild(template.content.cloneNode(true));

                this.#row = [];
                this.scrollTop = this.scrollHeight;
                resolve();
            }

            this.#row.push(word);
            resolve();
        })
    }
}

customElements.define(HighlightMemo.name, HighlightMemo);