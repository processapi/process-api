import { SizesManager } from "./virtualization/sizes-manager.js";

export class VirtualizationModule {
    static async get_sizes_manager(args) {
        const { count, defaultSize, sizes } = args;
        return new SizesManager(count, defaultSize, sizes);
    }
}