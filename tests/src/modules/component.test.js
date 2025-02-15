import { ComponentModule } from "../../../src/modules/component.js";
import { assertEquals } from "jsr:@std/assert";

Deno.test("ComponentModule.load_html - should return HTML content when url is provided", async () => {
	const mockFetch = (url) => {
		if (url.endsWith(".html")) {
			return Promise.resolve({
				text: () => Promise.resolve("<div>Component HTML</div>"),
			});
		}
	};
	globalThis.fetch = mockFetch;

	const html = await ComponentModule.load_html({
		url: "component.js",
		hasCss: false,
	});
	assertEquals(html, "<div>Component HTML</div>");
});

Deno.test("ComponentModule.load_html - should include CSS link when hasCss is true", async () => {
	const mockFetch = (url) => {
		if (url.endsWith(".html")) {
			return Promise.resolve({
				text: () => Promise.resolve("<div>Component HTML</div>"),
			});
		}
	};
	globalThis.fetch = mockFetch;

	const html = await ComponentModule.load_html({
		url: "component.js",
		hasCss: true,
	});
	assertEquals(
		html,
		'<link rel="stylesheet" href="component.css"><div>Component HTML</div>',
	);
});

Deno.test("ComponentModule.load_html - should not include CSS link when hasCss is false", async () => {
	const mockFetch = (url) => {
		if (url.endsWith(".html")) {
			return Promise.resolve({
				text: () => Promise.resolve("<div>Component HTML</div>"),
			});
		}
	};
	globalThis.fetch = mockFetch;

	const html = await ComponentModule.load_html({
		url: "component.js",
		hasCss: false,
	});
	assertEquals(html, "<div>Component HTML</div>");
});
