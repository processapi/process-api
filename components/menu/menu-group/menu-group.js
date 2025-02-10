import { ComponentModule } from "../../../src/modules/component.js";

class MenuGroup extends HTMLElement {
    static name = Object.freeze("menu-group");

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

customElements.define(MenuGroup.name, MenuGroup);
