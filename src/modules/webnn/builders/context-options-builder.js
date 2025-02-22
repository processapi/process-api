import PowerOptions from "./../power-options.js";
import DeviceType from "../device-type.js";

export default class ContextOptionsBuilder {
    #contextType;
    #powerPreference;

    constructor(contextType = DeviceType.GPU, powerPreference = PowerOptions.DEFAULt) {
        this.#contextType = contextType;
        this.#powerPreference = powerPreference;
    }

    setContextType(contextType) {
        this.#contextType = contextType;
        return this;
    }

    setPowerPreference(powerPreference) {
        this.#powerPreference = powerPreference;
        return this;
    }

    build() {
        return {
            deviceType: this.#contextType,
            powerPreference: this.#powerPreference
        };
    }
}