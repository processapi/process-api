import "./../../src/main.ts";
import { assertExists } from "jsr:@std/assert";

Deno.test("loading", () => {
    assertExists(globalThis.processApi);
})
