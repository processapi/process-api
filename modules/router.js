// deno-lint-ignore-file require-await

/**
 * The RouterModule is a module that provides routing capabilities to the application.
 * It is used to lookup routes from a dictionary of routes.
 * 
 * Routes example: { 
 *     "home": "/", 
 *     "about": "/about", 
 *     "person": "person/:id", 
 *     "contacts": "/person/:id/contacts",
 *     "contact": "/person/:id/contacts/:contactId" 
 * }
 * 
 * @class RouterModule
 * @method init - Initialize the module
 * @method dispose - Dispose the module
 * @method getRoute - Get the route from the route dictionary
 * @property name - Name of the module
 */

class RouterModule {
    /**
     * @field routes
     * @description Routes dictionary used as a lookup table for the routes supported
     * @type {Dictionary}
     * @static
     */
    static routes;

    /**
     * @field name
     * @description Name of the module
     * @type {string}
     * @static
     * @readonly
     */
    static name = Object.freeze("router");

    /**
     * @method init
     * @description Initialize the router module by providing the routes lookup dictionary
     * @param args {Dictionary} - Dictionary of routes
     * @returns {Promise<void>}
     * @throws {Error} - If routes dictionary is not provided
     * 
     * @example
     * await RouterModule.init({ routes });
     * 
     * @example
     * await api.call("router", "init", { routes });
     */
    static async init(args) {
        const routes = args?.routes;

        if (!routes) {
            throw new Error("Routes dictionary not provided");
        }

        this.routes = routes;
    }

    /**
     * @method dispose
     * @description Destroy the router module by clearning the instanciated resources
     * @returns {Promise<void>}
     * 
     * @example
     * await RouterModule.dispose();
     * 
     * @example
     * await crs.call("router", "dispose");
     */
    static async dispose() {
        this.routes = null;
    }

    /**
     * @method getRoute
     * @description Get the route from the route dictionary
     * @param args {Object} - Route to lookup and parameters to replace in the route
     * @param args.route {string} - Route to lookup defaults to "home" if not provided
     * @param args.params {Dictionary} - Parameters to replace in the route
     * @returns {Promise<string>}
     * 
     * @example without parameters
     * const route = await RouterModule.getRoute({ route: "home" });
     * 
     * @example with parameters
     * const route = await RouterModule.getRoute({ route: "person", params: { id: 1 } });
     * 
     * @example without parameters
     * const route = await crs.call("router", "getRoute", { route: "home" });
     * 
     * @example with parameters
     * const route = await crs.call("router", "getRoute", { route: "person", params: { id: 1 } });
     */
    static async getRoute(args) {
        const route = args?.route ?? "home";
        const params = args?.params ?? {};

        if (this.routes && this.routes[route]) {
            return extractParams(this.routes[route], params);
        }
        
        throw new Error(`Route not found: ${route}`);
    }
}

/**
 * @function extractParams
 * @description Extract parameters from the route
 * @param {string} route - route to process
 * @param {string} params - parameters to replace in the route
 * @returns {string} - processed route
 */
function extractParams(route, params) {
    return route.replace(/:([a-zA-Z]+)/g, (_, key) => {
        if (params[key] === undefined) {
            throw new Error(`Missing parameter: ${key}`);
        }
        return params[key];
    });
}

export { RouterModule };
