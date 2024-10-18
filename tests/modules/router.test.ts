import { assertEquals } from "jsr:@std/assert";
import { assertThrowsAsync } from "https://deno.land/std@0.55.0/testing/asserts.ts";
import { RouterModule } from "./../../modules/router.ts";

const sampleRoutes = {
    "home": "/",
    "about": "/about",
    "person": "/person/:id",
    "contacts": "/person/:id/contacts"
};

Deno.test("RouterModule init sets routes correctly", async () => {
    await RouterModule.init(sampleRoutes);
    assertEquals(RouterModule["routes"], sampleRoutes);
});

Deno.test("RouterModule dispose sets routes to null", async () => {
    await RouterModule.init(sampleRoutes);
    await RouterModule.dispose();
    assertEquals(RouterModule["routes"], null);
});

Deno.test("RouterModule getRoute returns correct route", async () => {
    await RouterModule.init(sampleRoutes);
    const route = await RouterModule.getRoute("home");
    assertEquals(route, "/");
});

Deno.test("RouterModule getRoute throws error for invalid route", async () => {
    await RouterModule.init(sampleRoutes);
    await assertThrowsAsync(
        async () => {
            await RouterModule.getRoute("invalid");
        },
        Error,
        "Route not found: invalid"
    );
});