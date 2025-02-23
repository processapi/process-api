import DeviceType from "./device-type.js";
import PowerOptions from "./power-options.js";

export class WebNNProgram {
    #context;
    #graphBuilder;
    #graph;
    #inputTensors = {};
    #outputTensors = {};

    async init(deviceType = DeviceType.GPU, powerPreference = PowerOptions.DEFAULT) {
        const contextOptions = {
            deviceType,
            powerPreference
        };

        this.#context = await navigator.ml.createContext(contextOptions);
        this.#graphBuilder = new MLGraphBuilder(this.#context);
    }

    /**
     * Create tensor on context
     * @param {*} context 
     * @param {*} operand 
     * @param {*} writable 
     * @param {*} readable 
     * @returns 
     */
    async #createTensor(operand, writable, readable) {
        return await this.#context.createTensor({
            dataType: operand.dataType, shape: operand.shape, writable, readable
        })
    }

    async addInputTensor(name, operand) {
        this.#inputTensors[name] = await this.#createTensor(operand, true, false);
    }

    async addOutputTensor(name, operand) {
        this.#outputTensors[name] = await this.#createTensor(operand, false, true);
    }

    addToGraph(action, ...args) {
        return this.#graphBuilder[action](...args);
    }

    async set(name, values) {
        await this.#context.writeTensor(this.#inputTensors[name], new Float32Array(values));
    }

    async build(args) {
        this.#graph = await this.#graphBuilder.build(args);
    }

    async run() {
        this.#context.dispatch(this.#graph, this.#inputTensors, this.#outputTensors);

        const outputKey = Object.keys(this.#outputTensors)[0];
        const output = await this.#context.readTensor(this.#outputTensors[outputKey]);
        return new Float32Array(output)[0];
    }
}

// const program = new WebNNProgram();
// program.buildGraph();
// const result = program.run({a: 1, b: 2});