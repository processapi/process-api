import { assertEquals, assert } from "jsr:@std/assert";
import { assertThrowsAsync } from "https://deno.land/std@0.55.0/testing/asserts.ts";
import { SurrealDBModule } from "../../../src/modules/surrealdb.js";

SurrealDBModule.url = "http://localhost:8000";

Deno.test("SurrealDBModule - status", async () => {
    const status = await SurrealDBModule.status();
    assertEquals(status, { status: "OK" });
});

Deno.test("SurrealDBModule - version", async () => {
    const version = await SurrealDBModule.version();
    assert(version.length > 0);
});

Deno.test("SurrealDBModule - signin", async () => {
    const result = await SurrealDBModule.signin({ user: "root", pass: "root" });
    assertEquals(result, { status: "OK" });
})

Deno.test("SurrealDBModule - create namespace", async () => {
    const result = await SurrealDBModule.create_namespace({ ns: "test" });
    assertEquals(result.length, 1);
    assertEquals(result[0].status, "OK");
});

Deno.test("SurrealDBModule - create database", async () => {
    const result = await SurrealDBModule.create_database({ ns: "test", db: "test" });
    assertEquals(result.length, 1);
    assertEquals(result[0].status, "OK");
});