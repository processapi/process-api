import DeviceType from "./webnn/device-type.js";
import PowerOptions from "./webnn/power-options.js";
import DataType from "./webnn/data-type.js";
import OperandDescriptorBuilder from "./webnn/builders/operand-descriptor-builder.js";
import ContextOptionsBuilder from "./webnn/builders/context-options-builder.js";

class WebNNModule {
    static async available() {
        return navigator.ml !== undefined;
    }

    static async createContext(args = {}) {
        const options = new ContextOptionsBuilder(args.deviceType, args.powerPreference).build();
        return await navigator.ml.createContext(options);
    }

    static async createGraph(args = {}) {
        // https://www.w3.org/TR/webnn/#mlgraphbuilder
        const { context = await this.createContext() } = args;
        return new MLGraphBuilder(context);
    }
}

export { 
    WebNNModule, 
    DeviceType, 
    PowerOptions, 
    DataType,
    OperandDescriptorBuilder,
    ContextOptionsBuilder
};