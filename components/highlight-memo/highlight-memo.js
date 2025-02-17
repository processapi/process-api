import {ComponentModule} from "../../src/modules/component.js";
import {MarkdownModule} from "../../src/modules/markdown.js";
import { HTML } from "./highlight-memo.html.js";

export class HighlightMemo extends HTMLElement {
    static name = Object.freeze("highlight-memo");

    #row = [];

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = HTML;
    }

    async disconnectedCallback() {
        this.#row = null;
    }

    /**
     * Pushes a word into the memo.
     * This will automatically be added to a line until the word length is 0.
     * Then the line is converted from markdown to html and appended to the memo.
     * @param word
     * @returns {Promise<unknown>}
     */
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