const SUCCESS = "success";
const ERROR = "error";

/**
 * @class ValidationResult
 * @description This class is responsible for returning the result of the validation.
 */
export class ValidationResult {
    static isError(validation) {
        return validation.type === "error";
    }

    static isSuccess(validation) {
        return validation.type === "success";
    }

    /**
     * @method error
     * @description This method is responsible for returning an error message.
     * @param message {String} The message to return.
     * @param path {String} The path of the schema part.
     * @returns {{type: string, message}}
     */
    static error(message, path) {
        return Object.freeze({ type: "error", message, path });
    }

    /**
     * @method success
     * @description This method is responsible for returning a success message.
     * @param message {String} The message to return.
     * @param path {String} The path of the schema part.
     * @returns {{type: string}}
     */
    static success(message, path) {
        return Object.freeze({ type: "success", message, path });
    }
}