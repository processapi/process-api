import { ComponentModule } from "../../../src/modules/component.js";
import { EventsManager } from "../../../src/system/events-manager.js";
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

        await this.#addChevron();
        this.style.display = "flex";
    }

    #addChevron() {
        return new Promise((resolve) => {
            const chevron = document.createElement("material-icon");
            chevron.setAttribute("icon", "chevron_right");
            chevron.style.marginLeft = "auto";
            chevron.setAttribute("slot", "suffix");
            
            requestAnimationFrame(() => {
                const menuItem = this.querySelector("menu-item");
                menuItem.appendChild(chevron);
                resolve();
            });
        });
    }

    showSubMenu(isVisible) {
        const submenu = this.querySelector("menu-container");
        submenu.classList.remove("visible");

        if (isVisible) {
            submenu.classList.add("visible");
        }
    }
}

customElements.define(MenuGroup.name, MenuGroup);
