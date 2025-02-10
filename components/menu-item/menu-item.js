import { ComponentModule } from "../../src/modules/component.js";

class MenuItem extends HTMLElement {
    static name = Object.freeze("menu-item");

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.style.display = "none";
    }

    async connectedCallback() {
        this.shadowRoot.innerHTML = await ComponentModule.load_html({
            url: import.meta.url,
        });

        this.style.display = "flex";
    }

    disconnectedCallback() {

    }
}

customElements.define(MenuItem.name, MenuItem);
