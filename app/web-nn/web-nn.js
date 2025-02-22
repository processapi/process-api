import { EventsManager } from "../../src/system/events-manager.js";
import { 
    WebNNModule, 
    OperandDescriptorBuilder } from "../../src/modules/webnn.js";

export default class WebNNView extends HTMLElement {
    static tag = "webnn-view";

    #eventsManager = new EventsManager();
    #graphBuilder
    #graph;
    #context;
    #tensors;

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    async connectedCallback() {
		this.shadowRoot.innerHTML = await api.call("component", "load_html", {
			url: import.meta.url,
		});  

        requestAnimationFrame(() => {
            const button = this.shadowRoot.querySelector("button");
            this.#eventsManager.addEvent(button, "click", this.#submit.bind(this));
        })
        
        this.#context = await WebNNModule.createContext();
        this.#graphBuilder = await WebNNModule.createGraph( { context: this.#context } );
        const operands = await this.#createGraph();
        await this.#createTensors(operands.A, operands.B, operands.C);
    }

    async disconnectedCallback() {
        this.#eventsManager = this.#eventsManager.dispose();
    }

    async #createGraph() {
        const descriptor = new OperandDescriptorBuilder().build();
        const A = this.#graphBuilder.input("A", descriptor);
        const B = this.#graphBuilder.input("B", descriptor);
        const C = this.#graphBuilder.add(A, B);  

        this.#graph = await this.#graphBuilder.build({C});
        return { A, B, C };
    }

    async #createTensors(inputA, inputB, outputC) {
        this.#tensors = { 
            inputA: await this.#createTensor(this.#context, inputA, true, true), 
            inputB: await this.#createTensor(this.#context, inputB, true, true), 
            outputC: await this.#createTensor(this.#context, outputC, false, true)
        };
    }

    async #createTensor(context, operand, writable, readable) {
        return context.createTensor({
            dataType: operand.dataType, shape: operand.shape, writable, readable
        })
    }

    async #submit(event) {
        const value1 = this.shadowRoot.querySelector("#value1").value;
        const value2 = this.shadowRoot.querySelector("#value2").value;

        this.#context.writeTensor(this.#tensors.inputA, new Float32Array([value1]));
        this.#context.writeTensor(this.#tensors.inputB, new Float32Array([value2]));

        const inputs = {
            'A': this.#tensors.inputA,
            'B': this.#tensors.inputB
        };

        const outputs = {
            'C': this.#tensors.outputC
        };

        this.#context.dispatch(this.#graph, inputs, outputs);
        const output = await this.#context.readTensor(this.#tensors.outputC); 
        const result = new Float32Array(output)[0];
        this.shadowRoot.querySelector("#result").textContent = result;
    }
}

customElements.define(WebNNView.tag, WebNNView);