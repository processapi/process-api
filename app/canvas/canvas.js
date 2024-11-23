import {ComponentModule} from "../../src/modules/component.js";
import {CanvasModule} from "../../src/modules/canvas.js";

export default class CanvasView extends HTMLElement {
    static tag = "canvas-view";
    #canvasWorker;
    #mouseMoveHandler = this.#mouseMove.bind(this);
    #mouseClickHandler = this.#mouseClick.bind(this);
    #mouseScrollHandler = this.#mouseScroll.bind(this);

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    async connectedCallback() {
        this.shadowRoot.innerHTML = await ComponentModule.load_html({ url: import.meta.url, hasCss: true });

        requestAnimationFrame(async () => {
            const element =  this.shadowRoot.querySelector("canvas");
            element.addEventListener("mousemove", this.#mouseMoveHandler);
            element.addEventListener("click", this.#mouseClickHandler);
            element.addEventListener("wheel", this.#mouseScrollHandler);

            await this.#waitForCanvas();

            this.#canvasWorker = await CanvasModule.initialize({
                canvasElement: element,
                workerSource: new URL("./canvas-worker.js", import.meta.url).href
            });

            this.#canvasWorker.call("clear");
            await ComponentModule.ready({ element: this });
        })
    }

    #mouseMove(event) {
        this.#canvasWorker.call("mouseMove", event.offsetX, event.offsetY);
    }

    #mouseClick(event) {
        this.#canvasWorker.call("mouseClick", event.offsetX, event.offsetY);
    }

    #mouseScroll(event) {
        this.#canvasWorker.call("mouseScroll", event.deltaY);
    }

    #waitForCanvas() {
        return new Promise((resolve) => {
            const computedStyle = getComputedStyle(this);

            if (computedStyle.getPropertyValue('--canvas-width').trim() === '100%') {
                resolve();
            }
            else {
                requestAnimationFrame(() => this.#waitForCanvas().then(resolve));
            }
        });
    }

    async disconnectedCallback() {
        const canvas = this.shadowRoot.querySelector("canvas");
        canvas.removeEventListener("mousemove", this.#mouseMoveHandler);
        canvas.removeEventListener("click", this.#mouseClickHandler);
        canvas.removeEventListener("wheel", this.#mouseScrollHandler);

        this.#canvasWorker.terminate();
        this.#canvasWorker = null;
    }
}

customElements.define(CanvasView.tag, CanvasView);