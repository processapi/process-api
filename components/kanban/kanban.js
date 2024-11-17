import {ComponentModule} from "../../src/modules/component.js";
import {CanvasModule} from "../../src/modules/canvas.js";

export class Kanban extends HTMLElement {
    static name = Object.freeze("kanban-component");

    #canvasWorker;
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

    #animation() {
        this.#canvasWorker.call("clear");
    }
}

customElements.define(Kanban.name, Kanban);