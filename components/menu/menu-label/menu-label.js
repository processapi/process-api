import { HTML } from "./menu-label.html.js";

class MenuLabel extends HTMLElement {
    static name = Object.freeze("menu-label");

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = HTML;
    }
}

customElements.define(MenuLabel.name, MenuLabel);
