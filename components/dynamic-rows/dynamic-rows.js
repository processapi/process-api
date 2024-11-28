import {ComponentModule} from "../../src/modules/component.js";

class DynamicRows extends HTMLElement {
    static name = Object.freeze("dynamic-rows");

    #mouseDownHandler = this.#mouseDown.bind(this);
    #mouseMoveHandler = this.#mouseMove.bind(this);
    #mouseUpHandler = this.#mouseUp.bind(this);
    #animationHandler = this.#animation.bind(this);

    #translateY = {
        start: 0,
        current: 0
    }

    #pixelHeights;
    #topCellHeight;
    #bottomCellHeight;
    #gap;

    #index;
    #isAnimating = false;

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    async connectedCallback() {
        this.shadowRoot.innerHTML = await ComponentModule.load_html({
            url: import.meta.url,
        });

        this.style.setProperty("--heights", getGridTemplateRows(this).join(" "));
        this.addEventListener("mousedown", this.#mouseDownHandler);
    }

    disconnectedCallback() {
        this.removeEventListener("mousedown", this.#mouseDownHandler);
        this.#removeMouseListeners();
    }

    #animation() {
        if (!this.#isAnimating) return;

        const offset = this.#translateY.current - this.#translateY.start;

        this.#pixelHeights[this.#index] = `${Number(this.#topCellHeight) + offset}px`;
        this.#pixelHeights[this.#index + 2] = `${Number(this.#bottomCellHeight) - offset}px`;

        // ensure that the gap is not less than the minimum
        for (let i = 0; i < this.#pixelHeights.length; i++) {
            const width = Number(this.#pixelHeights[i].replace("px", ""));
            if (width < this.#gap) {
                this.#pixelHeights[i] = `${this.#gap}px`;
            }
        }

        this.style.setProperty("--heights", this.#pixelHeights.join(" "));

        requestAnimationFrame(this.#animationHandler);
    }

    #mouseDown(event) {
        const target = event.composedPath()[0];

        if (target.classList.contains("resize-handle")) {
            this.#index = parseInt(target.dataset.index);

            this.addEventListener("mousemove", this.#mouseMoveHandler);
            this.addEventListener("mouseup", this.#mouseUpHandler);

            this.#translateY.start = event.clientY;
            this.#translateY.current = event.clientY;

            const styles = getComputedStyle(this);

            this.#gap = Number(styles.gap.replace("px", ""));
            this.#pixelHeights = styles.gridTemplateRows.split(" ");
            this.#topCellHeight = this.#pixelHeights[this.#index].replace("px", "");
            this.#bottomCellHeight = this.#pixelHeights[this.#index + 2].replace("px", "");

            this.#isAnimating = true;
            this.#animationHandler();

            event.preventDefault();
            event.stopPropagation();
        }
    }

    #mouseMove(event) {
        this.#translateY.current = event.clientY;

        event.preventDefault();
        event.stopPropagation();
    }

    #mouseUp(event) {
        this.#isAnimating = false;
        this.#removeMouseListeners();

        this.#translateY.start = 0;
        this.#translateY.current = 0;

        event.preventDefault();
        event.stopPropagation();
    }

    #removeMouseListeners() {
        this.removeEventListener("mousemove", this.#mouseMoveHandler);
        this.removeEventListener("mouseup", this.#mouseUpHandler);
    }
}

function getGridTemplateRows(element) {
    const rows = [];

    let index = 0;
    let zIndex = 0;
    for (let child of element.children) {
        if (child.classList.contains("resize-handle")) {
            child.dataset.index = index - 1;
            rows.push("auto");
        }
        else {
            child.style.zindex = zIndex;
            zIndex += 1;
            rows.push(child.dataset.height ?? "1fr");
        }

        index += 1;
    }

    return rows;
}

customElements.define(DynamicRows.name, DynamicRows);