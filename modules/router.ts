// deno-lint-ignore-file require-await

/**
 * Module interface for the router module
 * Routes example: { 
 *     "home": "/", 
 *     "about": "/about", 
 *     "person": "person/:id", 
 *     "contacts": "/person/:id/contacts" 
 * }
 * 
 * @interface
 * @name Module
 * @method init - Initialize the module
 * @method dispose - Dispose the module
 * @method getRoute - Get the route from the route dictionary
 * @property name - Name of the module
 */

import { Module } from "./../src/interfaces/module.ts";

class RouterModule implements Module {
    private static routes: Record<string, string> | null = {};    
    public static name: string = "router";

    /**
     * Initialize the router module by providing the routes lookup dictionary
     * @param routes {Dictionary} - Dictionary of routes
     * @returns {Promise<void>}
     */
    static async init(routes: Record<string, string>): Promise<void> {
        if (!routes) {
            throw new Error("Routes dictionary not provided");
        }

        this.routes = routes;
    }

    /**
     * Destroy the router module by clearning the instanciated resources
     * @returns {Promise<void>}
     */
    public static async dispose(): Promise<void> {
        this.routes = null;
    }

    /**
     * Get the route from the route dictionary
     * @param route {string} - Route to lookup
     * @returns {Promise<string>}
     */
    public static async getRoute(route: string, params: Record<string, string> = {}): Promise<string> {
        if (this.routes && this.routes[route]) {
            return extractParams(this.routes[route], params);
        }
        
        throw new Error(`Route not found: ${route}`);
    }
}

function extractParams(route: string, params: Record<string, string>): string {
    return route.replace(/:([a-zA-Z]+)/g, (_, key) => {
        if (params[key] === undefined) {
            throw new Error(`Missing parameter: ${key}`);
        }
        return params[key];
    });
}

export { RouterModule };
