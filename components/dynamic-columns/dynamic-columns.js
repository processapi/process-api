import {ComponentModule} from "../../src/modules/component.js";

class DynamicColumns extends HTMLElement {
    static name = Object.freeze("dynamic-columns");

    #mouseDownHandler = this.#mouseDown.bind(this);
    #mouseMoveHandler = this.#mouseMove.bind(this);
    #mouseUpHandler = this.#mouseUp.bind(this);
    #animationHandler = this.#animation.bind(this);

    #columns;
    #width;

    #translateX = {
        start: 0,
        current: 0,
        startColumns: null,
    }

    #target;
    #frameId;
    #handles;
    #isAnimating = false;

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    async connectedCallback() {
        this.shadowRoot.innerHTML = await ComponentModule.load_html({
            url: import.meta.url,
        });

        this.#columns = (this.getAttribute("columns") ?? "1fr 1fr").split(" ");
        this.style.setProperty("--columns", this.#columns.join(" "));

        requestAnimationFrame(() => {
            this.#handles = createResizeHandles(this);
            this.addEventListener("mousedown", this.#mouseDownHandler);
        });
    }

    disconnectedCallback() {
        this.removeEventListener("mousedown", this.#mouseDownHandler);
        this.#removeMouseListeners();
    }

    #animation() {
        if (!this.#isAnimating) return;

        const offset = this.#translateX.current - this.#translateX.start;
        const index = parseInt(this.#target.dataset.index);
        const style = getComputedStyle(this);
        const columns = style.gridTemplateColumns.split(" ");
        const gapSize = parseFloat(style.gap.replace("px", ""));

        columns[index] = `${Math.max(this.#translateX.startColumns[index] + offset, gapSize)}px`;
        columns[columns.length - 1] = "1fr";
        this.style.setProperty("--columns", columns.join(" "));

        let handleX = 0;

        for (let i = 0; i < this.#handles.length; i++) {
            const handle = this.#handles[i];
            handleX += parseFloat(columns[i].replace("px", ""));
            handle.style.translate = `${handleX}px 0`;

            handleX += gapSize;
        }

        this.#frameId = requestAnimationFrame(this.#animationHandler);
    }

    #mouseDown(event) {
        const target = event.composedPath()[0];

        if (target.classList.contains("resize-handle")) {
            this.#target = target;

            this.addEventListener("mousemove", this.#mouseMoveHandler);
            this.addEventListener("mouseup", this.#mouseUpHandler);

            this.#translateX.start = event.clientX;
            this.#translateX.current = event.clientX;

            const style = getComputedStyle(this);
            this.#translateX.startColumns = style.gridTemplateColumns.split(" ").map(column => parseFloat(column.replace("px", "")));

            this.#width = style.width.replace("px", "");

            this.#isAnimating = true;
            this.#animationHandler();
        }
    }

    #mouseMove(event) {
        this.#translateX.current = event.clientX;
    }

    #mouseUp() {
        this.#isAnimating = false;
        cancelAnimationFrame(this.#frameId);

        this.#removeMouseListeners();

        this.#translateX.start = 0;
        this.#translateX.current = 0;
        this.#translateX.startColumns = null;
        this.#target = null;
    }

    #removeMouseListeners() {
        this.removeEventListener("mousemove", this.#mouseMoveHandler);
        this.removeEventListener("mouseup", this.#mouseUpHandler);
    }
}

function createResizeHandles(component) {
    const styles = getComputedStyle(component);
    const columns = styles.gridTemplateColumns.split(" ");
    const columnCount = columns.length;

    let x = 0;
    const handles = [];

    for (let i = 0; i < columnCount - 1; i++) {
        x += parseFloat(columns[i].replace("px", ""));

        const handle = document.createElement("div");
        handle.dataset.index = i;
        handle.classList.add("resize-handle");
        handle.style.translate = `${x}px 0`;
        component.shadowRoot.appendChild(handle);

        x += parseFloat(styles.gap.replace("px", ""));

        handles.push(handle);
    }

    return handles;
}

customElements.define(DynamicColumns.name, DynamicColumns);