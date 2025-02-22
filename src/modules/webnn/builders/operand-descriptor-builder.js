/**
 * OperandDescriptorBuilder class to build MLOperandDescriptor objects.
 * @see https://www.w3.org/TR/webnn/#dictdef-mloperanddescriptor
 */
import DataType from "./../data-type.js";

export default class OperandDescriptorBuilder {
    #dataType;
    #shape;

    /**
     * Creates an instance of OperandDescriptorBuilder.
     * @param {string} [dataType=DataType.FLOAT32] - The data type of the operand.
     * @param {number[]} [shape=[]] - The shape of the operand.
     */
    constructor(dataType = DataType.FLOAT32, shape = [1]) {
        this.#dataType = dataType;
        this.#shape = shape;
    }

    /**
     * Sets the data type of the operand.
     * @param {string} dataType - The data type of the operand.
     * @returns {OperandDescriptorBuilder} The builder instance.
     * @example
     * const builder = new OperandDescriptorBuilder().setDataType(DataType.INT16);
     */
    setDataType(dataType) {
        this.#dataType = dataType;
        return this;
    }

    /**
     * Sets the shape of the operand.
     * @param {number[]} shape - The shape of the operand.
     * @returns {OperandDescriptorBuilder} The builder instance.
     * @example
     * const builder = new OperandDescriptorBuilder().setShape([1, 2, 3]);
     */
    setShape(shape) {
        this.#shape = shape;
        return this;
    }

    /**
     * Builds the MLOperandDescriptor object.
     * @returns {{dataType: string, shape: number[]}} The operand descriptor.
     * @example
     * const descriptor = new OperandDescriptorBuilder()
     *     .setDataType(DataType.FLOAT32)
     *     .setShape([1, 2, 3])
     *     .build();
     */
    build() {
        return {
            dataType: this.#dataType,
            shape: this.#shape
        };
    }
}