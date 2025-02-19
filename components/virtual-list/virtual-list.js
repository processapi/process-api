import { HTML } from "./virtual-list.html.js";

/**
 * The VirtualList web component handles creating and displaying a virtual list.
 */
export class VirtualList extends HTMLElement {
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
    }

    /**
     * Method to update the list items.
     * @param {Array} items - The list items to display.
     */
    append(items) {
        // Update the virtual list with new items
    }
}

// Register custom element
customElements.define(VirtualList.name, VirtualList);
