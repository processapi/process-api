import { EventsManager } from "../../src/system/events-manager.js";
import { Program } from "../../src/webnn/program.js";

export default class WebNNView extends HTMLElement {
    static tag = "webnn-view";

    #eventsManager = new EventsManager();
    #program = new Program();

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
            const features = this.#program.addToGraph("input", "features", {dataType: 'float32', shape: [1, 2]});
            const weights = this.#program.addConstant({dataType: 'float32', shape: [2,1]}, [0.7, 0.3]);
            const bias = this.#program.addConstant({dataType: 'float32', shape: [1]}, [-0.5]);

            const weightedSum = this.#program.addToGraph("matmul", features, weights);
            const output = this.#program.addToGraph("add", weightedSum, bias);

            await this.#program.build({output});

            // 3. add input and output tensors
            await this.#program.addInputTensor("features", features);
            await this.#program.addOutputTensor("output", output);
        })        
    }

    async disconnectedCallback() {
        this.#eventsManager = this.#eventsManager.dispose();
        this.#program = this.#program.dispose();
    }

    async disconnectedCallback() {
        this.#eventsManager = this.#eventsManager.dispose();
    }

    async #submit(event) {
        const cloudiness = this.shadowRoot.querySelector("#cloudiness").value;
        const humidity = this.shadowRoot.querySelector("#humidity").value;

        await this.#program.set("features", [cloudiness, humidity]);
        this.shadowRoot.querySelector("#result").textContent = await this.#program.run();
    }
}

customElements.define(WebNNView.tag, WebNNView);