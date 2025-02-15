import { assertEquals } from "jsr:@std/assert";
import { RouterModule } from "../../../src/modules/router.js";

const sampleRoutes = {
	"": "/",
	"home": "/",
	"about": "/about",
	"person": "/person/:id",
	"contacts": "/person/:id/contacts",
	"contact": "/person/:id/contact/:contactId",
};

globalThis.history = {
	pushState: () => {},
};

let apiCall;

const apiMock = {
	try(module, method, args) {
		apiCall = { module, method, args };
	},
};

Deno.test("RouterModule init sets routes correctly", async () => {
	await RouterModule.init({ routes: sampleRoutes });
	assertEquals(RouterModule["routes"], sampleRoutes);
});

Deno.test("RouterModule dispose sets routes to null", async () => {
	await RouterModule.init({ routes: sampleRoutes });
	await RouterModule.dispose();
	assertEquals(RouterModule["routes"], null);
});

Deno.test("RouterModule get returns correct route", async () => {
	await RouterModule.init({ routes: sampleRoutes });
	const route = await RouterModule.get({ route: "home" });
	assertEquals(route, "/");
});

Deno.test("RouterModule.get - should return the correct route with parameters", async () => {
	await RouterModule.init({ routes: sampleRoutes });

	const route = await RouterModule.get({
		route: "person",
		params: { id: "123" },
	});
	assertEquals(route, "/person/123");

	const compoundRoute = await RouterModule.get({
		route: "contact",
		params: { id: "123", contactId: "456" },
	});
	assertEquals(compoundRoute, "/person/123/contact/456");
});

Deno.test("RouterModule.get - should handle routes without parameters", async () => {
	await RouterModule.init({
		routes: {
			"home": "/",
			"about": "/about",
		},
	});

	const homeRoute = await RouterModule.get({ route: "home" });
	assertEquals(homeRoute, "/");

	const aboutRoute = await RouterModule.get({ route: "about" });
	assertEquals(aboutRoute, "/about");
});

Deno.test("RouterModule.goto navigates to the correct route with parameters", async () => {
	RouterModule.routes = {
		"home": "/",
		"about": "/about",
		"person": "/person/:id",
	};

	const mockPushState = (state, title, url) => {
		assertEquals(url, "/person/1");
	};
	globalThis.history.pushState = mockPushState;

	await RouterModule.goto({ route: "person", params: { id: 1 }, api: apiMock });
});

Deno.test("RouterModule.goto publishes the correct message to the messaging module", async () => {
	RouterModule.routes = {
		"home": "/",
		"about": "/about",
		"person": "/person/:id",
	};

	const mockPublish = ({ topic, message }) => {
		assertEquals(topic, "routeChanged");
		assertEquals(message, { route: "person", params: { id: 1 } });
	};

	const mockApi = {
		try: (module, method, args) => {
			if (module === "messaging" && method === "publish") {
				mockPublish(args);
			}
		},
	};

	await RouterModule.goto({ route: "person", params: { id: 1 }, api: mockApi });
});
