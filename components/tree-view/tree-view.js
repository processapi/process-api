import { ComponentModule } from "../../src/modules/component.js";
import { DomParserModule } from "../../src/modules/dom-parser.js";
import { SystemModule } from "../../src/modules/system.js";

/**
 * The TreeView web component handles creating and displaying a tree view.
 */
export class TreeView extends HTMLElement {
    static name = Object.freeze("tree-view");

    // Private method to handle key down events
    #handleKeyDown = this.#keyDown.bind(this);

    // Key map for handling arrow keys
    #keyMap = {
        "ArrowDown": this.#selectNextNode,
        "ArrowUp": this.#selectPreviousNode,
        "ArrowRight": this.#expandNode,
        "ArrowLeft": this.#collapseNode,
    };

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

        if (!SystemModule.is_mobile()) {
            this.shadowRoot.addEventListener("keydown", this.#handleKeyDown);
        }
    }

    /**
     * Removes event listeners when the element is disconnected.
     */
    disconnectedCallback() {
        this.shadowRoot.removeEventListener("keydown", this.#handleKeyDown);
    }

    /**
     * Selects the next node in the tree view.
     */
    #selectNextNode() {
        const selectedNode = this.shadowRoot.querySelector(".selected");
        const nextNode = selectedNode?.nextElementSibling;
        if (nextNode) {
            this.#setSelectedNode(nextNode);
        }
    }

    /**
     * Selects the previous node in the tree view.
     */
    #selectPreviousNode() {
        const selectedNode = this.shadowRoot.querySelector(".selected");
        const previousNode = selectedNode?.previousElementSibling;
        if (previousNode) {
            this.#setSelectedNode(previousNode);
        }
    }

    /**
     * Expands the current node in the tree view.
     */
    #expandNode(node) {
        this.dispatchEvent(new CustomEvent("expanded", { detail: node }));
    }

    /**
     * Collapses the current node in the tree view.
     */
    #collapseNode(node) {
        this.dispatchEvent(new CustomEvent("collapsed", { detail: node }));
    }

    /**
     * Handles key down events and triggers the corresponding action.
     * @param {KeyboardEvent} event - The keyboard event.
     */
    #keyDown(event) {
        const key = event.key;
        
        if (this.#keyMap[key]) {
            this.#keyMap[key]();
        }
    }

    /**
     * Sets the selected node and updates ARIA attributes.
     * @param {HTMLElement} node - The node to be selected.
     */
    #setSelectedNode(node) {
        const selectedNode = this.shadowRoot.querySelector(".selected");
        if (selectedNode) {
            selectedNode.removeAttribute("aria-selected");
        }

        node.setAttribute("aria-selected", "true");
        this.dispatchEvent(new CustomEvent("node-selected", { detail: node }));
    }

    /**
     * Adds nodes to the tree view.
     * @param {HTMLElement} parentElement - The parent element to which nodes will be added.
     * @param {Array} dataCollection - The data collection to be used for creating nodes.
     * @param {string|HTMLElement} template - The template to be used for creating nodes.
     */
    addNodes(parentElement, dataCollection, template) {
        if (typeof template === "string") {
            template = this.shadowRoot.querySelector(`#${template}`);
        }

        const fragment = document.createDocumentFragment();
        for (const dataItem of dataCollection) {
            const instance = template.content.cloneNode(true);
            const element = instance.firstElementChild;

            DomParserModule.parse_element(element, dataItem);

            element.setAttribute("role", "treeitem");
            element.setAttribute("aria-selected", "false");

            fragment.appendChild(element);
        }

        parentElement ||= this.shadowRoot.querySelector("ul");
        parentElement.setAttribute("role", "tree");
        parentElement.appendChild(fragment);
    }
}

// Register custom element.
customElements.define(TreeView.name, TreeView);
