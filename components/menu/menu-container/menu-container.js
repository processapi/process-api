import { ComponentModule } from "../../../src/modules/component.js";
import "../menu-item/menu-item.js";
import "../divider-item/divider-item.js";
import "../menu-label/menu-label.js";
import "../menu-group/menu-group.js";

class MenuContainer extends HTMLElement {
    static name = Object.freeze("menu-container");

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

customElements.define(MenuContainer.name, MenuContainer);
