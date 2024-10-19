import { ProcessApi } from "../../src/main.js";
import { assertExists, assertEquals } from "jsr:@std/assert";

class MathModule {
    static name = "math";

    static add(args) {
        return args.a + args.b;
    }

    static subtract(args) {
        return args.a - args.b;
    }
}

Deno.test("loading", () => {
    const api = new ProcessApi();
    api.register(MathModule);

    const result = api.call("math", "add", {a: 1, b: 2});
    assertExists(result);
    assertEquals(result, 3);
})
