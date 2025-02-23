import { EventsManager } from "../../src/system/events-manager.js";
import { WebNNProgram } from "../../src/modules/webnn/webnn-program.js";

export default class WebNNView extends HTMLElement {
    static tag = "webnn-view";

    #eventsManager = new EventsManager();
    #program = new WebNNProgram();

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    async connectedCallback() {
		this.shadowRoot.innerHTML = await api.call("component", "load_html", {
			url: import.meta.url,
		});  

        requestAnimationFrame(async () => {
            const button = this.shadowRoot.querySelector("button");
            this.#eventsManager.addEvent(button, "click", this.#submit.bind(this));

            // 1. initialize
            await this.#program.init();
            
            // 2. build graph
            const descriptor = {dataType: 'float32', shape: [1]};
            const A = this.#program.addToGraph("input", "A", descriptor);
            const B = this.#program.addToGraph("input", "B", descriptor);
            const C = this.#program.addToGraph("add", A, B);
            this.#program.build({C});

            // 3. add input and output tensors
            await this.#program.addInputTensor("A", A);
            await this.#program.addInputTensor("B", B);
            await this.#program.addOutputTensor("C", C);
        })        
    }

    async disconnectedCallback() {
        this.#eventsManager = this.#eventsManager.dispose();
    }

    async #submit(event) {
        const value1 = this.shadowRoot.querySelector("#value1").value;
        const value2 = this.shadowRoot.querySelector("#value2").value;

        await this.#program.set("A", [value1]);
        await this.#program.set("B", [value2]);

        this.shadowRoot.querySelector("#result").textContent = await this.#program.run();
    }
}

customElements.define(WebNNView.tag, WebNNView);