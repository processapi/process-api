import {ValidationResult} from "./validation-result.js";

export function validate(schemaItem, def, path) {
    for (const key in def) {
        const isCritical = def[key].critical ?? null;
        const hasValue = containsValue(schemaItem[key]);

        if (isCritical === true && !hasValue) {
            return ValidationResult.error(`"${key}" is required`, path);
        }

        if (isCritical === false && !hasValue) {
            return ValidationResult.warning(`"${key}" is required`, path);
        }
    }

    return ValidationResult.success("valid", path);
}

function containsValue(value) {
    if (value == null) return false;
    return !(typeof value === "string" && value.trim() === "");
}