class ProcessApi {
    #modules = {};

    register(module) {
        this.#modules[module.name] = module;
    }

    getModule(name) {
        return this.#modules[name];
    }

    call(module, method, args) {
        return this.#modules[module][method](args);
    }
}

export { ProcessApi };

