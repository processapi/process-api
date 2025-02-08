import { ComponentModule } from "../../src/modules/component.js";

/**
 * The TreeView web component handles creating and displaying a tree view.
 */
export class TreeView extends HTMLElement {
    static name = Object.freeze("tree-view");

    /**
     * Constructor attaches a shadow root.
     */
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    /**
     * Loads HTML content.
     */
    async connectedCallback() {
        this.shadowRoot.innerHTML = await ComponentModule.load_html({
            url: import.meta.url,
        });
    }
}

// Register custom element.
customElements.define(TreeView.name, TreeView);
