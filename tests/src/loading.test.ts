import { ProcessApi, Args, Module} from "./../../src/main.ts";
import { assertExists, assertEquals } from "jsr:@std/assert";

class MathModule implements Module {
    static add(args: Args) {
        return args.a + args.b;
    }

    static subtract(args: Args) {
        return args.a - args.b;
    }
}

Deno.test("loading", () => {
    const api = new ProcessApi();
    api.register("math", MathModule);

    const result = api.call("math", "add", {a: 1, b: 2});
    assertExists(result);
    assertEquals(result, 3);
})
