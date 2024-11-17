import {ComponentModule} from "../../src/modules/component.js";
import {CanvasModule} from "../../src/modules/canvas.js";
import {groupData} from "./data-processor.js";

export class Kanban extends HTMLElement {
    static name = Object.freeze("kanban-component");

    #canvasWorker;
    #data;
    #animationHandler = this.#animation.bind(this);

    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    async connectedCallback() {
        this.shadowRoot.innerHTML = await ComponentModule.load_html({
            url: import.meta.url,
        });

        requestAnimationFrame(async () => {
            this.#canvasWorker = await CanvasModule.initialize({
                canvasElement: this.shadowRoot.querySelector("canvas"),
                workerSource: new URL("./kanban-worker.js", import.meta.url).href
            })

            this.#canvasWorker.call("clear");
        })
    }

    async disconnectedCallback() {
        cancelAnimationFrame(this.#animationHandler);
        this.#animationHandler = null;
        this.#canvasWorker.terminate();
        this.#canvasWorker = null;
        this.#data = null;
    }

    #animation() {
        this.#canvasWorker.call("clear");
    }

    setData(data, rowKey, columnKey) {
        this.#data = groupData(data, rowKey, columnKey);
    }
}

customElements.define(Kanban.name, Kanban);