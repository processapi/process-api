import { HTML } from "./tab-sheet.html.js";
export class TabSheet extends HTMLElement {
    static name = Object.freeze("tab-sheet");

    #clickHandler = this.#click.bind(this);

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = HTML;
        this.style.display = "none";
    }

    connectedCallback() {
        // 1. get all elements in the <slot> element.
        const slot = this.shadowRoot.querySelector(".content slot");
        const elements = slot.assignedElements();

        // 2. for each element, set aria-hidden to true
        for (const element of elements) {
            element.setAttribute("aria-hidden", "true");
        }

        requestAnimationFrame(() => {
            this.#selectFirstTab();
            this.style.display = "flex";

            this.shadowRoot.querySelector(".header").addEventListener("click", this.#clickHandler);
        })
    }

    disconnectedCallback() {
        this.shadowRoot.querySelector(".header").removeEventListener("click", this.#clickHandler);
    }

    #click(event) {
        const target = event.composedPath()[0];
        const id = target.getAttribute("for");
        if (id == null) return;

        this.selectTab(id);
    }

    #selectFirstTab() {
        const slot = this.shadowRoot.querySelector(".header slot");
        const elements = slot.assignedElements();
        if (elements.length === 0) return;

        const firstTab = elements[0];
        const id = firstTab.getAttribute("for");
        this.selectTab(id);
    }

    selectTab(id) {
        const currentTab = this.querySelector("[aria-selected]");
        if (currentTab != null) {
            currentTab.removeAttribute("aria-selected");
            const currentId = currentTab.getAttribute("for");
            const currentContent = this.querySelector(`#${currentId}`);
            currentContent.setAttribute("aria-hidden", "true");
        }

        const newTab = this .querySelector(`[for="${id}"]`);
        newTab.setAttribute("aria-selected", "true");
        const newContent = this.querySelector(`#${id}`);
        newContent.removeAttribute("aria-hidden");
    }
}

customElements.define(TabSheet.name, TabSheet);