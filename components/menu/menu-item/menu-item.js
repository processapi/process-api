import { HTML } from "./menu-item.html.js";

class MenuItem extends HTMLElement {
    static name = Object.freeze("menu-item");

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = HTML;
    }
}

customElements.define(MenuItem.name, MenuItem);
