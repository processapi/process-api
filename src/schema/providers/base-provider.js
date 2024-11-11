import {ValidationResult} from "../validation-result.js";
import {schemaItemAt} from "../path-finder.js";

export class BaseProvider {
    /**
     * @method parse
     * @description This method is responsible for parsing the schema and generating HTML code.
     * @param template {String} The template to use for generating the HTML code.
     * @param schemaItem {Object} The schema JSON object.
     * @param path {String} The path of the schema part
     * @returns {String} The HTML code generated from the schema.
     */
    static async parse(template, schemaItem, path) {
        let result = structuredClone(template);

        for (const key of Object.keys(schemaItem)) {
            const stringTag = `__${key}__`;
            const value = schemaItem[key];
            result = result.replaceAll(stringTag, value);
        }

        return ValidationResult.success(result, path);
    }

    /**
     * @method validate
     * @description This method is responsible for validating the schema.
     * @param schemaItem {Object} The schema JSON object.
     * @param path {String} The path of the schema part
     * @returns {ValidationResult} True if the schema is valid, false otherwise.
     */
    static async validate(schemaItem, path) {
        return ValidationResult.success("success", path);
    }

    /**
     * @method create
     * @description This method is responsible for creating a new element in the schema for a given path.
     * @param schema {Object} The schema
     * @param path {String} The path of the schema part
     * @param schemaItem {Object} The element to create
     * @returns {ValidationResult} True if the schema is valid, false otherwise.
     */
    static async create(schema, path, schemaItem) {
        const parent = schemaItemAt(schema, path);
        parent.elements ||= [];
        parent.elements.push(schemaItem);
    }

    /**
     * @method update
     * @description This method is responsible for updating an existing element in the schema for a given path.
     * @param schema {Object} The schema
     * @param path {String} The path of the schema part
     * @param schemaItem {Object} The element to update
     * @returns {ValidationResult} True if the schema is valid, false otherwise.
     */
    static async update(schema, path, schemaItem) {
        const obj = schemaItemAt(schema, path);

        if (obj == null) {
            return ValidationResult.error("Element not found", path);
        }

        Object.assign(obj, schemaItem);
        return schemaItem;
    }

    /**
     * @method delete
     * @description This method is responsible for deleting an existing element in the schema for a given path.
     * It also checks for dependencies and removes them if necessary
     * @param schema {Object} The schema
     * @param path {String} The path of the schema part
     * @returns {ValidationResult} True if the schema is valid, false otherwise.
     */
    static async delete(schema, path) {
        const object = schemaItemAt(schema, path);
        const parentPath = path.substring(0, path.lastIndexOf("/"));
        const parent = schemaItemAt(schema, parentPath);

        const index = parent.elements.indexOf(object);
        parent.elements.splice(index, 1);
    }
}
