import { ComponentModule } from "../../src/modules/component.js";
import "./../menu-item/menu-item.js";

class MainMenu extends HTMLElement {
    static name = Object.freeze("main-menu");

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

customElements.define(MainMenu.name, MainMenu);
