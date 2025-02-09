import { ComponentModule } from "../../src/modules/component.js";
import { DomParserModule } from "../../src/modules/dom-parser.js";

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
        await ComponentModule.load_component({
            element: this,
            url: import.meta.url,
        });
    }

    addNodes(parentElement, dataCollection, template) {
        if (typeof template === "string") {
            template = this.shadowRoot.querySelector(`#${template}`);
        }

        const fragment = document.createDocumentFragment();
        for (const dataItem of dataCollection) {
            const instance = template.content.cloneNode(true);
            const element = instance.firstElementChild;

            DomParserModule.parse_element(element, dataItem);

            fragment.appendChild(element);
        }

        parentElement ||= this.shadowRoot.querySelector("ul");
        parentElement.appendChild(fragment);
    }
}

// Register custom element.
customElements.define(TreeView.name, TreeView);
