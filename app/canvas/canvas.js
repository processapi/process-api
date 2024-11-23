import {ComponentModule} from "../../src/modules/component.js";
import {QuadTreeModule} from "../../src/modules/quadtree.js";
import {CanvasModule} from "../../src/modules/canvas.js";

export default class CanvasView extends HTMLElement {
    static tag = "canvas-view";
    #canvasWorker;

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    async connectedCallback() {
        this.shadowRoot.innerHTML = await ComponentModule.load_html({ url: import.meta.url, hasCss: true });

        requestAnimationFrame(async () => {
            this.#canvasWorker = await CanvasModule.initialize({
                canvasElement: this.shadowRoot.querySelector("canvas"),
                workerSource: new URL("./canvas-worker.js", import.meta.url).href
            });

            this.#canvasWorker.call("clear");
            await ComponentModule.ready({ element: this });

            this.#canvasWorker.call("clear");
        })
    }

    async disconnectedCallback() {
        this.#canvasWorker.terminate();
        this.#canvasWorker = null;
    }
}

customElements.define(CanvasView.tag, CanvasView);