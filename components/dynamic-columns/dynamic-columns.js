import {ComponentModule} from "../../src/modules/component.js";

/**
 * todo:
 * 1. add resize support
 */
class DynamicColumns extends HTMLElement {
    static name = Object.freeze("dynamic-columns");

    #mouseDownHandler = this.#mouseDown.bind(this);
    #mouseMoveHandler = this.#mouseMove.bind(this);
    #mouseUpHandler = this.#mouseUp.bind(this);
    #animationHandler = this.#animation.bind(this);

    #translateX = {
        start: 0,
        current: 0,
        location: 0
    }

    #target;
    #frameId;

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    async connectedCallback() {
        this.shadowRoot.innerHTML = await ComponentModule.load_html({
            url: import.meta.url,
        });

        const columns = this.getAttribute("columns");
        this.style.setProperty("--columns", columns ?? "1fr 1fr");

        requestAnimationFrame(() => {
            createResizeHandles(this);
            this.addEventListener("mousedown", this.#mouseDownHandler);
        })
    }

    async disconnectedCallback() {
        this.removeEventListener("mousedown", this.#mouseDownHandler);
        this.#mouseDownHandler = null;
        this.#mouseMoveHandler = null;
        this.#mouseUpHandler = null;
        this.#animationHandler = null;
    }

    #animation() {
        const x = this.#translateX.location + (this.#translateX.current - this.#translateX.start);
        this.#target.style.translate = `${x}px 0`;
        this.#frameId = requestAnimationFrame(this.#animationHandler);
    }

    #mouseDown(event) {
        const target = event.composedPath()[0];

        if (target.classList.contains("resize-handle")) {
            this.#target = target;
            this.#translateX.location = parseFloat(this.#target.style.translate.split(" ")[0].replace("px", ""));

            this.addEventListener("mousemove", this.#mouseMoveHandler);
            this.addEventListener("mouseup", this.#mouseUpHandler);

            this.#translateX.start = event.clientX;
            this.#translateX.current = event.clientX;
            this.#animationHandler();
        }
    }

    #mouseMove(event) {
        this.#translateX.current = event.clientX;
    }

    #mouseUp(event) {
        cancelAnimationFrame(this.#frameId);

        this.removeEventListener("mousemove", this.#mouseMoveHandler);
        this.removeEventListener("mouseup", this.#mouseUpHandler);

        this.#translateX.start = 0;
        this.#translateX.current = 0;
        this.#target = null;
    }
}

function createResizeHandles(component) {
    const styles = getComputedStyle(component);
    const columns = styles.gridTemplateColumns.split(" ");
    const columnCount = columns.length;

    let x = 0;

    for (let i = 0; i < columnCount - 1; i++) {
        x += parseFloat(columns[i].replace("px", ""));

        const handle = document.createElement("div");
        handle.classList.add("resize-handle");
        handle.style.translate = `${x}px 0`;
        component.shadowRoot.appendChild(handle);

        x += parseFloat(styles.gap.replace("px", ""));
    }
}

customElements.define(DynamicColumns.name, DynamicColumns);