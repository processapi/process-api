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
     * Create tensor on context.
     * @param {Object} operand - The operand descriptor.
     * @param {boolean} writable - Whether the tensor is writable.
     * @param {boolean} readable - Whether the tensor is readable.
     * @returns {Object} The created tensor.
     */
    #createTensor(operand, writable, readable) {
        return this.#context.createTensor({
            dataType: operand.dataType, shape: operand.shape, writable, readable
        });
    }

    /**
     * Add an input tensor to the program.
     * @param {string} name - The name of the tensor.
     * @param {Object} operand - The operand object.
     * @returns {Promise<void>}
     */
    async addInputTensor(name, operand) {
        this.#inputTensors[name] = await this.#createTensor(operand, true, false);
    }

    /**
     * Add an output tensor to the program.
     * @param {string} name - The name of the tensor.
     * @param {Object} operand - The operand object.
     * @returns {Promise<void>}
     */
    async addOutputTensor(name, operand) {
        this.#outputTensors[name] = await this.#createTensor(operand, false, true);
    }

    /**
     * Add a constant to the graph.
     * @param {Object} descriptor - The descriptor of the constant.
     * @param {Array<number>} values - The values of the constant.
     * @returns {Object} The created constant.
     */
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
    async set(name, values) {
        await this.#context.writeTensor(this.#inputTensors[name], new Float32Array(values));
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
 * const descriptor = {dataType: 'float32', shape: [1, 2]};
 * const features = program.addToGraph("input", "features", descriptor);
 * const weights = program.addConstant({dataType: 'float32', shape: [2, 1]}, [0.7, 0.3]);
 * const bias = program.addConstant({dataType: 'float32', shape: [1]}, [-0.5]);
 * 
 * const weightedSum = program.addToGraph("matmul", features, weights);
 * const output = program.addToGraph("add", weightedSum, bias);
 * await program.build({output});
 * 
 * await program.addInputTensor("features", features);
 * await program.addOutputTensor("output", output);
 * 
 * await program.set("features", [0.5, 0.8]);
 * 
 * const result = await program.run();
 * console.log(result); // Output: some computed value
 */