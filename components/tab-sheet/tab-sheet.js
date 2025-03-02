import { HTML } from "./tab-sheet.html.js";
export class TabSheet extends HTMLElement {
    static name = Object.freeze("tab-sheet");

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = HTML;
    }
}

customElements.define(TabSheet.name, TabSheet);