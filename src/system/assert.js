
const ERROR = globalThis.LOG_LEVELS?.ERROR ?? "error";

export function assert(condition, message, context = "", data = null, logLevel = ERROR) {
    if (!condition) {
        globalThis.logger?.[logLevel](message, context, data);
        return false;
    }
    return true;
}

globalThis.assert = assert;