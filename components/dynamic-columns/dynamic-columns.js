import {ComponentModule} from "../../src/modules/component.js";
import { HTML } from "./dynamic-columns.html.js";

class DynamicColumns extends HTMLElement {
    static name = Object.freeze("dynamic-columns");

    #mouseDownHandler = this.#mouseDown.bind(this);
    #mouseMoveHandler = this.#mouseMove.bind(this);
    #mouseUpHandler = this.#mouseUp.bind(this);
    #animationHandler = this.#animation.bind(this);

    #translateX = {
        start: 0,
        current: 0,
        minWidths: [],
    }

    #pixelWidths;
    #leftCellWidth;
    #rightCellWidth;
    #gap;

    #index;
    #isAnimating = false;

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = HTML;
    }

    async connectedCallback() {
        const { columns, minWidths } = getGridTemplateColumns(this);
        this.#translateX.minWidths = minWidths;

        this.style.setProperty("--columns", columns.join(" "));
        this.addEventListener("mousedown", this.#mouseDownHandler);
    }

    disconnectedCallback() {
        this.removeEventListener("mousedown", this.#mouseDownHandler);
        this.#removeMouseListeners();
    }

    #animation() {
        if (!this.#isAnimating) return;

        const offset = this.#translateX.current - this.#translateX.start;

        this.#pixelWidths[this.#index] = `${Number(this.#leftCellWidth) + offset}px`;
        this.#pixelWidths[this.#index + 2] = `${Number(this.#rightCellWidth) - offset}px`;

        // ensure that the gap is not less than the minimum
        for (let i = 0; i < this.#pixelWidths.length; i++) {
            const width = Number(this.#pixelWidths[i].replace("px", ""));
            if (width < this.#gap) {
                this.#pixelWidths[i] = `${this.#gap}px`;
            }
        }

        this.style.setProperty("--columns", this.#pixelWidths.join(" "));

        requestAnimationFrame(this.#animationHandler);
    }

    #mouseDown(event) {
        const target = event.composedPath()[0];

        if (target.classList.contains("resize-handle")) {
            this.#index = parseInt(target.dataset.index);

            this.addEventListener("mousemove", this.#mouseMoveHandler);
            this.addEventListener("mouseup", this.#mouseUpHandler);

            this.#translateX.start = event.clientX;
            this.#translateX.current = event.clientX;

            const styles = getComputedStyle(this);

            this.#gap = Number(styles.gap.replace("px", ""));
            this.#pixelWidths = styles.gridTemplateColumns.split(" ");
            this.#leftCellWidth = this.#pixelWidths[this.#index].replace("px", "");
            this.#rightCellWidth = this.#pixelWidths[this.#index + 2].replace("px", "");

            this.#isAnimating = true;
            this.#animationHandler();

            event.preventDefault();
            event.stopPropagation();
        }
    }

    #mouseMove(event) {
        this.#translateX.current = event.clientX;
        event.preventDefault();
        event.stopPropagation();
    }

    #mouseUp(event) {
        this.#isAnimating = false;
        this.#removeMouseListeners();

        this.#translateX.start = 0;
        this.#translateX.current = 0;

        event.preventDefault();
        event.stopPropagation();
    }

    #removeMouseListeners() {
        this.removeEventListener("mousemove", this.#mouseMoveHandler);
        this.removeEventListener("mouseup", this.#mouseUpHandler);
    }
}

function getGridTemplateColumns(element) {
    const columns = [];
    const minWidths = [];

    let index = 0;
    for (let child of element.children) {
        if (child.classList.contains("resize-handle")) {
            child.dataset.index = index - 1;
            columns.push("auto");
        }
        else {
            child.classList.add("cell");
            columns.push(child.dataset.width ?? "1fr");
            minWidths.push(Number(child.dataset.minWidth ?? "100"));
        }

        index += 1;
    }

    return { columns, minWidths };
}

customElements.define(DynamicColumns.name, DynamicColumns);