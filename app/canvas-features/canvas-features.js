import { CanvasModule } from "../../src/modules/canvas.js";

export default class CanvasFeaturesView extends HTMLElement {
    static tag = "canvas-features-view";
    #canvasWorker;

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    async connectedCallback() {
        this.shadowRoot.innerHTML = await api.call("component", "load_html", {
            url: import.meta.url,
        });

        requestAnimationFrame(async () => {
            await this.#initialize();
            await api.call("component", "ready", { element: this });
        });
    }

    async #initialize() {
        const element = this.shadowRoot.querySelector("canvas");
        this.#canvasWorker = await CanvasModule.initialize({
            canvasElement: element,
            workerSource: new URL("./canvas-worker.js", import.meta.url).href
        });        
    }

    load(data) {
        // Implement the load method
    }
}

customElements.define(CanvasFeaturesView.tag, CanvasFeaturesView);
