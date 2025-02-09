import { ComponentModule } from "../../src/modules/component.js";
import { DomParserModule } from "../../src/modules/dom-parser.js";
import { SystemModule } from "../../src/modules/system.js";
import { EventsManager } from "../../src/system/events-manager.js";

/**
 * The TreeView web component handles creating and displaying a tree view.
 */
export class TreeView extends HTMLElement {
    static name = Object.freeze("tree-view");

    #eventsManager = new EventsManager();

    // Key map for handling arrow keys
    #keyMap = {
        "ArrowDown": this.#selectNextNode,
        "ArrowUp": this.#selectPreviousNode,
        "ArrowRight": this.#expandNode,
        "ArrowLeft": this.#collapseNode,
    };

    // WeakMap to store done callbacks for nodes
    #doneCallbacks = new WeakMap();

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

        this.#eventsManager.addPointerEvent(this.shadowRoot, "click", this.#click.bind(this));

        if (!SystemModule.is_mobile()) {
            this.#eventsManager.addKeyboardEvent(this.shadowRoot, "keydown", this.#keyDown.bind(this));
        }

        this.style.display = "block";
    }

    /**
     * Removes event listeners when the element is disconnected.
     */
    disconnectedCallback() {
        this.#eventsManager.dispose();
        this.#doneCallbacks = new WeakMap();
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
     * Marks a node as busy or not busy.
     * @param {HTMLElement} node - The node to be marked.
     * @param {boolean} isBusy - Whether the node is busy.
     */
    #markNodeAsBusy(node, isBusy) {
        node.setAttribute("aria-busy", isBusy);
    }

    /**
     * Expands the current node in the tree view.
     * @param {HTMLElement} node - The node to be expanded.
     */
    #expandNode(node) {
        this.#markNodeAsBusy(node, true);

        const doneCallback = () => {
            node.setAttribute('has-children', node.children.length > 0);

            if (node.children.length > 0) {
                node.setAttribute('aria-expanded', 'true');
            }

            this.#markNodeAsBusy(node, false);
            this.#doneCallbacks.delete(node);
        };

        this.#doneCallbacks.set(node, doneCallback);

        this.dispatchEvent(new CustomEvent("expanded", { 
            detail: {
                treeView: this,
                node,
                doneCallback
            }
        }));
    }

    /**
     * Collapses the current node in the tree view.
     * @param {HTMLElement} node - The node to be collapsed.
     */
    #collapseNode(node) {
        node.setAttribute('aria-expanded', 'false');
        this.dispatchEvent(new CustomEvent("collapsed", { detail: node }));
    }

    /**
     * Handles click events and triggers the corresponding action.
     * @param {Event} event - The click event.
     */
    #click(event) {
        const target = event.target;
        const li = target.closest("li");
        const isExpandButton = target.matches(".expander");

        this.#setSelectedNode(li);

        if (isExpandButton) {
            const isExpanded = li.getAttribute("aria-expanded") === "true";

            if (isExpanded) {
                this.#collapseNode(li);
            } else {
                this.#expandNode(li);
            }
        }
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
        template ||= "simple-item";

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
            element.setAttribute("has-children", dataItem._hasChildren ?? true);
            fragment.appendChild(element);
        }

        parentElement ||= this.shadowRoot.querySelector("ul");

        if (parentElement.tagName === "LI") {
            const container = document.createElement("ul");
            parentElement.appendChild(container);
            parentElement = container;
        }

        parentElement.appendChild(fragment);
    }
}

// Register custom element.
customElements.define(TreeView.name, TreeView);
