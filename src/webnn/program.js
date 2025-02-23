import DeviceType from "./device-type.js";
import PowerOptions from "./power-options.js";

/**
 * Class representing a WebNN program.
 */
export class Program {
    #context;
    #graphBuilder;
    #graph;
    #inputTensors = {};
    #outputTensors = {};

    /**
     * Initialize the program.
     * @param {DeviceType} deviceType - The type of device to use.
     * @param {PowerOptions} powerPreference - The power preference for the device.
     * @returns {Promise<void>}
     */
    async init(deviceType = DeviceType.GPU, powerPreference = PowerOptions.DEFAULT) {
        const contextOptions = {
            deviceType,
            powerPreference
        };

        this.#context = await navigator.ml.createContext(contextOptions);
        this.#graphBuilder = new MLGraphBuilder(this.#context);
    }

    /**
     * Dispose of the program resources.
     * @returns {void}
     */
    dispose() {
        this.#context = null;
        this.#graphBuilder = null;
        this.#graph = null;
        this.#inputTensors = null;
        this.#outputTensors = null;
    }

    /**
     * Create tensor on context
     * @param {*} operand 
     * @param {*} writable 
     * @param {*} readable 
     * @returns 
     */
    #createTensor(operand, writable, readable) {
        return this.#context.createTensor({
            dataType: operand.dataType, shape: operand.shape, writable, readable
        })
    }

    /**
     * Add an input tensor to the program.
     * @param {string} name - The name of the tensor.
     * @param {Object} tensor - The tensor object.
     * @returns {Promise<void>}
     */
    async addInputTensor(name, operand) {
        this.#inputTensors[name] = await this.#createTensor(operand, true, false);
    }

    /**
     * Add an output tensor to the program.
     * @param {string} name - The name of the tensor.
     * @param {Object} tensor - The tensor object.
     * @returns {Promise<void>}
     */
    async addOutputTensor(name, operand) {
        this.#outputTensors[name] = await this.#createTensor(operand, false, true);
    }

    addConstant(descriptor, values) { 
        return this.#graphBuilder.constant(descriptor, new Float32Array(values));
    }

    /**
     * Add a node to the graph.
     * @param {string} action - The type of the node (e.g., "input", "add").
     * @param {...*} args - The arguments for the node.
     * @returns {Object} The created node.
     */
    addToGraph(action, ...args) {
        return this.#graphBuilder[action](...args);
    }

    /**
     * Set the value of a tensor.
     * @param {string} name - The name of the tensor.
     * @param {Array<number>} values - The value to set.
     * @returns {Promise<void>}
     */
    set(name, values) {
        this.#context.writeTensor(this.#inputTensors[name], new Float32Array(values));
    }

    /**
     * Build the graph with the specified outputs.
     * @param {Object} args - The outputs of the graph.
     * @returns {Promise<void>}
     */
    async build(args) {
        this.#graph = await this.#graphBuilder.build(args);
    }

    /**
     * Run the program and get the result.
     * @returns {Promise<number>} The result of the computation.
     */
    async run() {
        this.#context.dispatch(this.#graph, this.#inputTensors, this.#outputTensors);

        const outputKey = Object.keys(this.#outputTensors)[0];
        const output = await this.#context.readTensor(this.#outputTensors[outputKey]);
        return new Float32Array(output)[0];
    }
}

/**
 * Example usage:
 * 
 * const program = new Program();
 * await program.init();
 * 
 * const descriptor = {dataType: 'float32', shape: [1]};
 * const A = program.addToGraph("input", "A", descriptor);
 * const B = program.addToGraph("input", "B", descriptor);
 * const C = program.addToGraph("add", A, B);
 * program.build({C});
 * 
 * await program.addInputTensor("A", A);
 * await program.addInputTensor("B", B);
 * await program.addOutputTensor("C", C);
 * 
 * await program.set("A", [1]);
 * await program.set("B", [2]);
 * 
 * const result = await program.run();
 * console.log(result); // Output: 3
 */