export function assert(condition, message, context = "", data = null) {
    if (!condition) {
        globalThis.logger?.error(message, context, data);
        return false;
    }
    return true;
}

globalThis.assert = assert;