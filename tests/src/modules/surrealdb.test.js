import { assertEquals, assert } from "jsr:@std/assert";
import { assertThrowsAsync } from "https://deno.land/std@0.55.0/testing/asserts.ts";
import { SurrealDBModule } from "../../../src/modules/surrealdb.js";

SurrealDBModule.url = "http://localhost:8000";

Deno.test("SurrealDBModule - status", async () => {
    const status = await SurrealDBModule.status();
    assertEquals(status, { status: "ok" });
});

Deno.test("SurrealDBModule - version", async () => {
    const version = await SurrealDBModule.version();
    assert(version.length > 0);
});