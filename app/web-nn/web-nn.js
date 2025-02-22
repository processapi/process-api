import { WebNNModule, OperandDescriptorBuilder } from "../../src/modules/webnn.js";

export default class WebNNView extends HTMLElement {
    static tag = "webnn-view";

    #context;

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    async connectedCallback() {
		this.shadowRoot.innerHTML = await api.call("component", "load_html", {
			url: import.meta.url,
		});  
        
        const operandType = await WebNNModule.createOperandType({ dimensions: [2, 2]});
        const graphBuilder = await WebNNModule.createGraph();

        const constant2 = graphBuilder.constant(new OperandDescriptorBuilder().build(), new Float32Array([0.2]));
        console.log(constant2);
    }
}

customElements.define(WebNNView.tag, WebNNView);