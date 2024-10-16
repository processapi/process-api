import {Module} from "./interfaces/module.ts";
import {Args} from "./interfaces/args.ts";

class ProcessApi {
    #modules: Record<string, Module>;

    constructor() {
        this.#modules = {};
    }

    register(name: string, module: Module) {
        this.#modules[name] = module;
    }

    getModule(name: string): Module | undefined {
        return this.#modules[name];
    }

    call(module: string, method: string, args: Args) {
        return this.#modules[module][method](args);
    }
}

export { ProcessApi };
export type { Module, Args };
