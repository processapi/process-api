import {ComponentModule} from "../../src/modules/component.js";

class DynamicColumns extends HTMLElement {
    static name = Object.freeze("dynamic-columns");

    #mouseDownHandler = this.#mouseDown.bind(this);
    #mouseMoveHandler = this.#mouseMove.bind(this);
    #mouseUpHandler = this.#mouseUp.bind(this);
    #animationHandler = this.#animation.bind(this);

    #translateX = {
        start: 0,
        current: 0
    }

    #columns;
    #widths;
    #width;
    #width2;
    #gap;

    #target;
    #isAnimating = false;

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    async connectedCallback() {
        this.shadowRoot.innerHTML = await ComponentModule.load_html({
            url: import.meta.url,
        });

        this.#columns = getGridTemplateColumns(this);
        this.style.setProperty("--columns", this.#columns.join(" "));
        this.addEventListener("mousedown", this.#mouseDownHandler);
    }

    disconnectedCallback() {
        this.removeEventListener("mousedown", this.#mouseDownHandler);
        this.#removeMouseListeners();
    }

    #animation() {
        if (!this.#isAnimating) return;

        const index = parseInt(this.#target.dataset.index);
        const offset = this.#translateX.current - this.#translateX.start;

        this.#widths[index] = `${Number(this.#width) + offset}px`;
        this.#widths[index + 2] = `${Number(this.#width2) - offset}px`;

        // ensure that the gap is not less than the minimum
        for (let i = 0; i < this.#widths.length; i++) {
            const width = Number(this.#widths[i].replace("px", ""));
            if (width < this.#gap) {
                this.#widths[i] = `${this.#gap}px`;
            }
        }

        this.style.setProperty("--columns", this.#widths.join(" "));

        requestAnimationFrame(this.#animationHandler);
    }

    #mouseDown(event) {
        const target = event.composedPath()[0];

        if (target.classList.contains("resize-handle")) {
            this.#target = target;

            this.addEventListener("mousemove", this.#mouseMoveHandler);
            this.addEventListener("mouseup", this.#mouseUpHandler);

            this.#translateX.start = event.clientX;
            this.#translateX.current = event.clientX;

            const index = parseInt(this.#target.dataset.index);
            this.#widths = structuredClone(this.#columns);

            const styles = getComputedStyle(this);
            this.#gap = Number(styles.gap.replace("px", ""));
            this.#widths = styles.gridTemplateColumns.split(" ");
            this.#width = this.#widths[index].replace("px", "");
            this.#width2 = this.#widths[index + 2].replace("px", "");
            this.#widths[this.#widths.length - 1] = "1fr";

            this.#isAnimating = true;
            this.#animationHandler();
        }
    }

    #mouseMove(event) {
        this.#translateX.current = event.clientX;
    }

    #mouseUp() {
        this.#isAnimating = false;
        this.#removeMouseListeners();

        this.#translateX.start = 0;
        this.#translateX.current = 0;
        this.#target = null;
    }

    #removeMouseListeners() {
        this.removeEventListener("mousemove", this.#mouseMoveHandler);
        this.removeEventListener("mouseup", this.#mouseUpHandler);
    }
}

function getGridTemplateColumns(element) {
    const columns = [];

    let index = 0;
    for (let child of element.children) {
        if (child.classList.contains("resize-handle")) {
            child.dataset.index = index - 1;
            columns.push("auto");
        }
        else {
            columns.push(child.dataset.widths ?? "1fr");
        }

        index += 1;
    }

    return columns;
}

customElements.define(DynamicColumns.name, DynamicColumns);