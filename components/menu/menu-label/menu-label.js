import { ComponentModule } from "../../../src/modules/component.js";

class MenuLabel extends HTMLElement {
    static name = Object.freeze("menu-label");

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
}

customElements.define(MenuLabel.name, MenuLabel);
