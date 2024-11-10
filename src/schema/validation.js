import {ValidationResult} from "./validation-result.js";

export function validate(schemaItem, def) {
    for (const key in def) {
        const isCritical = def[key].critical ?? false;
        const hasValue = containsValue(schemaItem[key]);

        if (isCritical && !hasValue) {
            return ValidationResult.error(`"${key}" is required`);
        }

        if (!isCritical && !hasValue) {
            return ValidationResult.warning(`"${key}" is required`);
        }
    }

    return ValidationResult.success("valid");
}

function containsValue(value) {
    if (value == null) return false;
    return !(typeof value === "string" && value.trim() === "");
}