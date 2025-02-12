import { ComponentModule } from "../../src/modules/component.js";

/**
 * The ToolBar web component handles creating and displaying a toolbar.
 */
export class ToolBar extends HTMLElement {
    static name = Object.freeze("tool-bar");

    /**
     * Constructor attaches a shadow root.
     */
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.style.display = "none";
    }

    /**
     * Loads HTML content.
     */
    async connectedCallback() {
        await ComponentModule.load_component({
            element: this,
            url: import.meta.url,
        });

        this.style.display = "block";
    }
}

// Register custom element.
customElements.define(ToolBar.name, ToolBar);
