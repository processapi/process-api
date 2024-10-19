/**
 * ProcessApi class is a registry of modules you can call.
 * This provides you with a isolated environment to run your code.
 * Each module is a class with methods that you can call, but uses seperation of concerns.
 * For you to be able to call a method from a module, you need to register it first.
 * This means you can register the module once but call it throughout the application.
 * You can also lazy load modules, so you only load the module when you need it, and not all at once.
 * This is useful for performance reasons.
 * Modules are static classes, so you don't need to instantiate them.
 * Each module is self contained, so you can't access the state of another module.
 * They also initialize and cleanup after themselves.
 *
 * @example
 * import { ExampleModule } from './example-module.js';
 * const api = new ProcessApi();
 * api.register(ExampleModule);
 *
 * // Call the method from the module
 * api.call('example', 'method_name', { arg1: 'value' });
 *
 * As you can see in this above example we need three parameters.
 * The first is the module name, this is a static field on the module class.
 * The second is the method name you want to call.
 * The third is the arguments you want to pass to the method.
 * The args parameter is optional, so you can call a method without arguments.
 * Args is a object, so you can pass multiple arguments.
 *
 * The main purpose of the process api is to provide a callable interface to modules.
 * This callable interface can be called from code but also used by a process manager.
 * The process manager for example takes in a JSON object and calls the process api with the module and method name.
 * Each step in the process is a module and method that is called.
 *
 * If you have other process managers, for example a text based intent definition, the process api provides a standard callable interface.
 *
 * @class ProcessApi
 */
class ProcessApi {
  #modules = {};

  /**
   * @method register
   * @description Register a module to the api
   * @param {class} module to register
   * @returns {void}
   *
   * @example
   * api.register(ExampleModule);
   */
  register(module) {
    this.#modules[module.name] = module;
  }

  /**
   * @method getModule
   * @description Get a module from the api
   * @param {string} name of the module
   * @returns {class} module
   * @throws {Error} if module is not found
   *
   * @example
   * const module = api.getModule('example');
   * module.method_name({ arg1: 'value' });
   */
  getModule(name) {
    return this.#modules[name];
  }

  /**
   * @method call
   * @description Call a method from a module
   * @param {string} module name
   * @param {string} method name
   * @param {object} args to pass to the method
   * @returns {any} result of the method
   * @throws {Error} if module or method is not found or if the method throws an error
   *
   * @example
   * api.call('example', 'method_name', { arg1: 'value' });
   */
  call(module, method, args) {
    return this.#modules[module][method](args);
  }
}

export { ProcessApi };
