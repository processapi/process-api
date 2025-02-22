import DeviceType from "./webnn/device-type.js";
import PowerOptions from "./webnn/power-options.js";
import DataType from "./webnn/data-type.js";
import OperandDescriptorBuilder from "./webnn/builders/operand-descriptor-builder.js";

class WebNNModule {
    static async available() {
        return navigator.ml !== undefined;
    }

    static createOperandDescriptor(args = {}) {
        const { dataType = DataType.FLOAT32, shape = [] } = args;
        return { dataType, shape };
    }

    static createOperandType(args= {}) {
        const { dataType = DataType.FLOAT32, dimensions = [] } = args;
        return { dataType, dimensions };
    }

    static async createContextOption(args = {}) {
        const { deviceType = DeviceType.GPU, powerPreference = PowerOptions.DEFAULt } = args;
        return { deviceType, powerPreference };
    }

    static async createContext(args = {}) {
        const options = await this.createContextOption(args.options);
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
    OperandDescriptorBuilder
};