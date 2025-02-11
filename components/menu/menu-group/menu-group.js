import { ComponentModule } from "../../../src/modules/component.js";
import "./../../material-icon/material-icon.js";

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

        this.#addChevron();

        this.style.display = "flex";
    }

    #addChevron() {
        const chevron = document.createElement("material-icon");
        chevron.setAttribute("icon", "chevron_right");
        chevron.style.marginLeft = "auto";
        chevron.setAttribute("slot", "suffix");
        
        requestAnimationFrame(() => {
            const menuItem = this.querySelector("menu-item");
            menuItem.appendChild(chevron);
        })
    }
}

customElements.define(MenuGroup.name, MenuGroup);
