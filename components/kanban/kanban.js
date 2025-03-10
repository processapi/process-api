import {ComponentModule} from "../../src/modules/component.js";
import {CanvasModule} from "../../src/modules/canvas.js";
import {groupData} from "./data-processor.js";
import { HTML } from "./kanban.html.js";

export class Kanban extends HTMLElement {
    static name = Object.freeze("kanban-component");

    #canvasWorker;
    #data;
    #animationHandler = this.#animation.bind(this);

    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.shadowRoot.innerHTML = HTML;
    }

    async connectedCallback() {
        this.#canvasWorker = await CanvasModule.initialize({
            canvasElement: this.shadowRoot.querySelector("canvas"),
            workerSource: new URL("./kanban-worker.js", import.meta.url).href
        })

        this.#canvasWorker.call("clear");
        await ComponentModule.ready({element: this});
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

        console.log(this.#data);
    }
}

customElements.define(Kanban.name, Kanban);