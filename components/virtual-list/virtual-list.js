import { HTML } from "./virtual-list.html.js";
import { SizesManager } from "../../src/modules/virtualization/sizes-manager.js";

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

    /**
     * Method to update the list items.
     * @param {Array} items - The list items to display.
     */
    load(items, template, inflateFn) {
        this.#template = template;
        this.#inflateFn = inflateFn;

        // Update the virtual list with new items
        this.#data.push(...items);
        this.#sizeManager = new SizesManager(this.#data.length, 32);
    }
}

// Register custom element
customElements.define(VirtualList.name, VirtualList);
