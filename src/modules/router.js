// deno-lint-ignore-file require-await

import {validateArgs} from "../validate/validate-args.js";

const DEFAULT_ROUTE = "home";

/**
 * The RouterModule is a module that provides routing capabilities to the application.
 * It is used to lookup routes from a dictionary of routes.
 * The one route that is required is the home route.
 * This will affect views in that if you navigate to "/" it should show the home view.
 *
 * Routes example: {
 *     "home": "/",
 *     "about": "/about",
 *     "person": "person/:id",
 *     "contacts": "/person/:id/contacts",
 *     "contact": "/person/:id/contacts/:contactId",
 *     "filter": "/filter?name=:name&age=:age",
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
		validateArgs(args, {
			routes: { type: "object", required: true },
		}, "RouterModule.init: ");

		this.routes = args.routes;

		this.routeUpdateHandler = routeUpdated.bind(args.api);

		addEventListener("popstate", this.routeUpdateHandler);
		addEventListener("hashchange", this.routeUpdateHandler);
		addEventListener("load", this.routeUpdateHandler);
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

		removeEventListener("popstate", this.routeUpdateHandler);
		removeEventListener("hashchange", this.routeUpdateHandler);
		removeEventListener("load", this.routeUpdateHandler);
		this.routeUpdateHandler = null;
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
	static async get(args) {
		validateArgs(args, {
			route: { type: "string", default: "home" },
			params: { type: "object", default: {} },
		}, "RouterModule.getRoute: ");

		const { route, params } = args;

		if (this.routes && this.routes[route]) {
			return extractParams(this.routes[route], params);
		}

		throw new Error(`Route not found: ${route}`);
	}

	/**
	 * @method goto
	 * @description Navigate to a route with the provided parameters
	 * @param {Object} args
	 * @param {string} args.route - Route to navigate to
	 * @param {Object} args.params - Parameters to replace in the route
	 * @returns {Promise<void>}
	 */
	static async goto(args) {
		validateArgs(args, {
			route: { type: "string", required: true },
			params: { type: "object", default: {} },
		}, "RouterModule.goto: ");

		const { route, params } = args;

		const path = await this.get({ route, params });
		history.pushState({}, "", path);

		args.api.try("messaging", "publish", {
			topic: "routeChanged",
			message: { route, params },
		});
	}
}

/**
 * @function extractParams
 * @description Extract parameters from the route
 * @param route {string} - route to process
 * @param params {Object} - parameters to replace in the route
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

/**
 * @function urlToParts
 * @description This converts a URL to its parts of the route and parameters.
 * @param {string} url
 *
 * @returns {Object} - Object with route and parameters
 *
 * @exmaple
 * The URL "/person/1/contacts/2" will be converted to:
 * {
 *     route: ["/person", "/contacts"],
 *     params: {
 * 		   id: 1,
 * 		   contactId: 2
 *     }
 * }
 */
function urlToParts(url, search) {
	const [route, queryString] = url.split("?");
	const parts = route.split("/").filter(Boolean);
	const routeParts = [];
	const routeParams = {};

	// Process route parts
	for (let i = 0; i < parts.length; i++) {
		if (i % 2 === 0) {
			routeParts.push(parts[i]);
		} else {
			routeParams[parts[i - 1].slice(1)] = parts[i];
		}
	}

	// Process query string parameters
	if (queryString) {
		const queryParams = new URLSearchParams(queryString);
		for (const [key, value] of queryParams.entries()) {
			routeParams[key] = value;
		}
	}

	// Process search parameters
	if (search) {
		const searchParams = new URLSearchParams(search);
		for (const [key, value] of searchParams.entries()) {
			routeParams[key] = value;
		}
	}

	if (routeParts.length === 0) {
		routeParts.push(DEFAULT_ROUTE);
	}

	return { route: routeParts, params: routeParams };
}

function routeUpdated() {
	const parts = urlToParts(location.pathname, location.search);

	this.try("messaging", "publish", {
		topic: "routeChanged",
		message: parts,
	});
}

export { RouterModule };
