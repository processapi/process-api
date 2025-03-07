import { HTML } from "./virtual-list.html.js";
import { SizesManager } from "../../src/modules/virtualization/sizes-manager.js";
import { ComponentModule } from "../../src/modules/component.js";
import { IdleModule } from "../../src/modules/idle.js";

/**
 * The VirtualList web component handles creating and displaying a virtual list.
 */
export class VirtualList extends HTMLElement {
    // container related properties
    #ul;
    #onULScrollHandler = this.#onULScroll.bind(this);
    #scrollTop = 0;
    #marker;
    #listItems = [];
    #visibleRange;
    #animating = false;
    #animateHandler = this.#animate.bind(this);
    #lastTime = 0;

    // input properties
    #onClickHandler = this.#onClick.bind(this);
    #onDoubleClickHandler = this.#onDoubleClick.bind(this);
    #onKeyDownHandler = this.#onKeyDown.bind(this);
    #selected;
    #selectedIndex;

    // item related properties
    #template;
    #inflateFn;

    // data related properties
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
        this.#ul = this.shadowRoot.querySelector("ul");
        this.#ul.addEventListener("scroll", this.#onULScrollHandler);
        this.#ul.addEventListener("click", this.#onClickHandler);
        this.#ul.addEventListener("dblclick", this.#onDoubleClickHandler);
        this.#ul.addEventListener("keydown", this.#onKeyDownHandler);
        await ComponentModule.ready({element: this});
    }

    /**
     * Clean up when the component is disconnected.
     */
    disconnectedCallback() {
        this.#ul.removeEventListener("scroll", this.#onULScrollHandler);
        this.#ul.removeEventListener("click", this.#onClickHandler);
        this.#ul.removeEventListener("dblclick", this.#onDoubleClickHandler);
        this.#ul.removeEventListener("keydown", this.#onKeyDownHandler);

        // Clean up resources here
        this.#ul = null;
        this.#data = null;
        this.#sizeManager = this.#sizeManager.dispose();
        this.#template = null;
        this.#inflateFn = null;
        this.#listItems = null;
        this.#marker = null;
        this.#onULScrollHandler = null;
        this.#visibleRange = null;
        this.#animateHandler = null;
        this.#lastTime = null;
        this.#selected = null;
        this.#selectedIndex = null;
    }
    
    #animate() {
        const deltaTime = performance.now() - this.#lastTime;
        if (deltaTime > 200) {
            this.#animating = false;
        }

        let top = this.#sizeManager.top(this.#visibleRange.start);
        for (let i = 0; i < this.#listItems.length; i++) {
            const element = this.#listItems[i];
            element.style.translate = `0px ${top}px`;
            element.removeAttribute("aria-selected");

            const index = this.#visibleRange.start + i;
            top += this.#sizeManager.at(index);
            element.dataset.index = index;

            if (this.#selectedIndex === index) {
                element.setAttribute("aria-selected", "true");
                this.#selected = element;
            }

            const data = this.#data[index];
            if (data != null) {
                this.#inflateFn(element, this.#data[index]);
            }
        }

        if (this.#animating) {
            requestAnimationFrame(this.#animateHandler);
        }
    }

    #onULScroll(event) {
        this.#lastTime = performance.now();
        this.#scrollTop = event.target.scrollTop;
        this.#visibleRange = this.#sizeManager.getVisibleRange(this.#scrollTop, this.offsetHeight);

        if (this.#animating === false) {
            this.#animating = true;
            this.#animateHandler();
        }
    }

    #loadElements() {
        const height = this.offsetHeight;
        this.#visibleRange = this.#sizeManager.getVisibleRange(0, height);
        const totalHeight = this.#sizeManager.totalSize;

        if (height <= totalHeight) {
            this.#createElements(totalHeight);
        }
    }

    #createElements(markerY) {
        const fragment = document.createDocumentFragment();
        const { start, end } = this.#visibleRange;

        let top = 0;
        for (let i = start; i <= end; i++) {
            const item = this.#data[i];
            const element = this.#template.content.cloneNode(true).firstElementChild;
            element.style.position = "absolute";
            element.style.translate = `0px ${top}px`;

            const index = this.#visibleRange.start + i;
            top += this.#sizeManager.at(index);

            element.dataset.index = index;
            this.#inflateFn(element, item);
            fragment.appendChild(element);

            this.#listItems.push(element);
        }

        this.#ul.innerHTML = "";
        this.#ul.appendChild(fragment);

        this.#marker = createMarker(markerY);
        this.#ul.appendChild(this.#marker);
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
        console.log(this.#sizeManager);
        IdleModule.perform({ tasks: [this.#loadElements.bind(this)] });
    }

    #setSelected(li, notify = false) {
        if (this.#selected != null) {
            this.#selected.removeAttribute("aria-selected");
        }

        this.#selected = li;
        this.#selected.setAttribute("aria-selected", "true");
        this.#selectedIndex = parseInt(li.dataset.index);
        const selectedData = this.#data[this.#selectedIndex];

        if (notify) {
            this.dispatchEvent(new CustomEvent("item-selected", { detail: selectedData }));
        }
    }

    #onClick(event) {
        // Handle click event
        const target = event.composedPath()[0];
        const li = target.closest("li");
        this.#setSelected(li, true);
    }

    #onDoubleClick(event) {
        // Handle double click event
        const target = event.composedPath()[0];
        const li = target.closest("li");
        this.dispatchEvent(new CustomEvent("item-dbclick", { detail: li }));
    }

    #onKeyDown(event) {
        // Handle key down event
    }
}

// Register custom element
customElements.define(VirtualList.name, VirtualList);

function createMarker(y) {
    const marker = document.createElement("div");
    marker.style.position = "absolute";
    marker.style.width = "1px";
    marker.style.height = "1px";
    marker.style.visibility = "hidden";
    marker.style.translate = `0px ${y}px`;
    return marker;
}