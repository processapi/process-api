import {ComponentModule} from "../../src/modules/component.js";
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
            const element =  this.shadowRoot.querySelector("canvas");

            await this.#waitForCanvas();

            this.#canvasWorker = await CanvasModule.initialize({
                canvasElement: element,
                workerSource: new URL("./canvas-worker.js", import.meta.url).href
            });

            this.#canvasWorker.call("clear");
            await ComponentModule.ready({ element: this });
        })
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
        this.#canvasWorker.terminate();
        this.#canvasWorker = null;
    }
}

customElements.define(CanvasView.tag, CanvasView);