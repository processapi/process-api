import { ValidationResult } from './validation-result.js';
import { RawProvider } from "./providers/raw.js";

/**
 * @class SchemaManager
 * @description This class is responsible for generating HTML code from the schema.
 * The schema is a JSON object that represents the structure of the HTML code.
 * Different providers are registered with the HTMLGenerator to generate HTML code for different elements.
 * These providers also manage operations such as generating HTML, validating the schema part and making changes to the existing schema.
 */
export class SchemaManager {
    #providers = {};

    constructor() {
        this.registerProvider(RawProvider);
    }

    dispose() {
        this.#providers = null;
    }

    async #parseAttributes(template, schemaItem) {
        if (schemaItem.attributes == null) {
            return template.replace("__attributes__", "");
        }

        const attributes = [];
        for (const attribute of Object.keys(schemaItem.attributes)) {
            const attrValue = schemaItem.attributes[attribute];
            const attrString = `${attribute}="${attrValue}"`;
            attributes.push(attrString);
        }

        return template.replace("__attributes__", attributes.join(" "));
    }

    async #parseStyles(template, schemaItem) {
        // 1. no styles to manage
        if (schemaItem.styles == null) {
            return template.replace("__styles__", "");
        }

        // 2. process styles as classes if they are a string array
        if (Array.isArray(schemaItem.styles)) {
            const styles = `class="${schemaItem.styles.join(" ")}"`;
            return template.replace("__styles__", styles);
        }

        // 3. create styles from object
        const styles = [];
        for (const style of Object.keys(schemaItem.styles)) {
            const styleValue = schemaItem.styles[style];
            const styleString = `${style}:${styleValue};`;
            styles.push(styleString);
        }

        return template.replace("__styles__", `style="${styles.join(" ")}"`);
    }

    async #parseContent(template, schemaItem) {
        if (schemaItem.content != null) {
            return template.replace("__content__", schemaItem.content);
        }

        return await this.#parseChildren(template, schemaItem);
    }

    async #parseChildren(template, schemaItem) {
        if (schemaItem.elements == null) {
            return template.replace("__content__", "");
        }

        const children = [];

        for (const child of schemaItem.elements) {
            const childResult = await this.parseItem(child);

            if (ValidationResult.isError(childResult)) {
                return childResult;
            }

            children.push(childResult.message);
        }

        const childContent = children.join(" ").trim();
        return template.replace("__content__", childContent).trim();
    }

    registerProvider(provider) {
        this.#providers[provider.key] = provider;
    }

    /**
     * @method parse
     * @description This method is responsible for parsing the schema and generating HTML code.
     * @param schemaJson {Object} The schema JSON object.
     * @returns {ValidationResult} The HTML code generated from the schema.
     */
    async parse(schemaJson) {
        const body = schemaJson.body;
        const html = [];

        let index = 0;
        for (const element of body.elements) {
            const itemResult = await this.parseItem(element, `/[${index}]`);

            if (ValidationResult.isError(itemResult)) {
                return itemResult;
            }

            html.push(itemResult.message);
        }

        const result = html.join("").replace(/\s+>/g, '>');
        return ValidationResult.success(result, "/");
    }

    async parseItem(schemaItem, path) {
        const providerKey = schemaItem.element;
        const provider = this.#providers[providerKey] ?? this.#providers["raw"];

        const result = await provider.parse(schemaItem, path);

        if (ValidationResult.isError(result)) {
            return result;
        }

        let template = structuredClone(result.message);

        template = await this.#parseAttributes(template, schemaItem);
        template = await this.#parseStyles(template, schemaItem);
        template = await this.#parseContent(template, schemaItem);

        return ValidationResult.success(template.trim(), path);
    }

    /**
     * @method validate
     * @description This method is responsible for validating the schema.
     * By default, it will validate the entire schema.
     * If you define the path it will validate only that part of the schema.
     * @param schemaJson {Object} The schema JSON object.
     * @param path {String} The path of the schema part to validate.
     * @returns {ValidationResult} True if the schema is valid, false otherwise.
     */
    validate(schemaJson, path = null) {
        return ValidationResult.success("success");
    }

    /**
     * @method create
     * @description This method is responsible for creating a new element in the schema for a given path.
     * @param schemaJson {Object} The schema JSON object.
     * @param path {String} The path of the schema part
     * @param element {Object} The element to create.
     * @returns {ValidationResult} True if the schema is valid, false otherwise.
     */
    create(schemaJson, path, element) {
        return ValidationResult.success("success")
    }

    /**
     * @method update
     * @description This method is responsible for updating an existing element in the schema for a given path.
     * @param schemaJson {Object} The schema JSON object.
     * @param path {String} The path of the schema part
     * @param element {Object} The element to update.
     * @returns {ValidationResult} True if the schema is valid, false otherwise.
     *
     * @example
     * // Example of updating an existing element in the schema.
     * const schema = {
     *     "body": {
     *         "elements": [
     *             {
     *                 "id"     : "edtFirstName",
     *                 "element : "input",
     *                 "field"  : "firstName",
     *                 "title"  : "First Name",
     *             }
     *         ]
     *     }
     * }
     *
     * const schemaManager = new SchemaManager();
     * const result = schemaManager.update(schema, "/edtFirstName", { "title": "First Name Updated" });
     */
    update(schemaJson, path, element) {
        return ValidationResult.success("success")
    }

    /**
     * @method delete
     * @description This method is responsible for deleting an existing element in the schema for a given path.
     * @param schemaJson {Object} The schema JSON object.
     * @param path {String} The path of the schema part
     * @returns {ValidationResult} True if the schema is valid, false otherwise.
     */
    delete(schemaJson, path) {
        return ValidationResult.success("success")
    }
}