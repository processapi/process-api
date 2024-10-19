import { ProcessApi } from "../../src/main.js";
import { assertEquals, assertExists } from "jsr:@std/assert";

class MathModule {
	static name = "math";

	static async add(args) {
		return args.a + args.b;
	}

	static async subtract(args) {
		return args.a - args.b;
	}
}

Deno.test("ProcessApi - loading", async () => {
	const api = new ProcessApi();
	api.register(MathModule);

	const result = await api.call("math", "add", { a: 1, b: 2 });
	assertExists(result);
	assertEquals(result, 3);
});

Deno.test("ProcessApi - try", async () => {
	const api = new ProcessApi();
	api.register(MathModule);
	
	const result = await api.try("math", "add", { a: 1, b: 2 });
	assertExists(result);
	assertEquals(result, 3);
});

Deno.test("ProcessApi - try on non module", async () => {
	const api = new ProcessApi();
	
	const result = await api.try("math", "add", { a: 1, b: 2 });
	assertEquals(result, undefined);
});