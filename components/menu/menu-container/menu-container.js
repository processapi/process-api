import "../menu-item/menu-item.js";
import "../divider-item/divider-item.js";
import "../menu-label/menu-label.js";
import "../menu-group/menu-group.js";
import { HTML } from "./menu-container.html.js";

class MenuContainer extends HTMLElement {
    static name = Object.freeze("menu-container");

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = HTML;
    }

    async connectedCallback() {
        await this.#initialize();
    }

    async disconnectedCallback() {
        this.eventsManager = this.eventsManager.dispose();
    }

    async #initialize() {
        if (this.parentElement?.tagName !== "MENU-GROUP") {
            const module = await import("./menu-container-input.js");
            module.initializeInput(this);
        }
    }
}

customElements.define(MenuContainer.name, MenuContainer);
