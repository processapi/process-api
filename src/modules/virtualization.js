import { validateArgs } from "../validate/validate-args.js";
import { SizesManager } from "./virtualization/sizes-manager.js";

export class VirtualizationModule {
    static async get_sizes_manager(args) {
        validateArgs(args, {
            count: { type: "number", required: true },
            defaultSize: { type: "number", required: false },
            sizes: { type: "array", required: false }
        }, "VirtualizationModule.get_sizes_manager: ");

        const { count, defaultSize, sizes } = args;
        return new SizesManager(count, defaultSize, sizes);
    }
}