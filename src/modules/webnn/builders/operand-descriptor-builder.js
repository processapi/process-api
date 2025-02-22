import DataType  from "./../data-type.js";

export default class OperandDescriptorBuilder {
    #dataType;
    #shape;

    constructor(dataType = DataType.FLOAT32, shape = []) {
        this.#dataType = dataType;
        this.#shape = shape;
    }

    setDataType(dataType) {
        this.#dataType = dataType;
        return this;
    }

    setShape(shape) {
        this.#shape = shape;
        return this;
    }

    build() {
        return {
            dataType: this.#dataType,
            shape: this.#shape
        };
    }
}