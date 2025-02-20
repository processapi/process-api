import { HTML } from "./virtual-list.html.js";
import { SizesManager } from "../../src/modules/virtualization/sizes-manager.js";
import { ComponentModule } from "../../src/modules/component.js";
import { IdleModule } from "../../src/modules/idle.js";

/**
 * The VirtualList web component handles creating and displaying a virtual list.
 */
export class VirtualList extends HTMLElement {

    #template;
    #inflateFn;
    #sizeManager;
    #data = [];

    static name = Object.freeze("virtual-list");

    /**
     * Constructor attaches a shadow root.
     */
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = HTML;
    }

    /**
     * Loads HTML content and initializes the virtual list.
     */
    async connectedCallback() {
        // Initialize the virtual list here
        await ComponentModule.ready({element: this});
    }

    /**
     * Clean up when the component is disconnected.
     */
    disconnectedCallback() {
        // Clean up resources here
        this.#data = null;
        this.#sizeManager = this.#sizeManager.dispose();
        this.#template = null;
        this.#inflateFn = null;
    }
    
    #loadElements() {
        const height = this.offsetHeight;
        const visibleRange = this.#sizeManager.getVisibleRange(0, height);
        const totalHeight = this.#sizeManager.totalSize;

        if (height <= totalHeight) {
            this.#createElements(visibleRange);
        }
    }

    #createElements(visibleRange) {
        const fragment = document.createDocumentFragment();
        const { start, end } = visibleRange;

        for (let i = start; i <= end; i++) {
            const item = this.#data[i];
            const element = this.#template.content.cloneNode(true);
            this.#inflateFn(element, item);
            fragment.appendChild(element);
        }

        const container = this.shadowRoot.querySelector("#container");
        container.innerHTML = "";
        container.appendChild(fragment);
    }

    /**
     * Method to update the list items.
     * @param {Array} items - The list items to display.
     */
    async load(items, template, height, inflateFn, styles = []) {
        for (const style of styles) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href= style;
            this.shadowRoot.appendChild(link);
        }

        this.#template = template;
        this.#inflateFn = inflateFn;

        // Update the virtual list with new items
        this.#data.push(...items);
        this.#sizeManager = new SizesManager(this.#data.length, height);
        IdleModule.perform({ tasks: [this.#loadElements.bind(this)] });
    }
}

// Register custom element
customElements.define(VirtualList.name, VirtualList);
