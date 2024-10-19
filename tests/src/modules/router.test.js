import { assertEquals } from "jsr:@std/assert";
import { assertThrowsAsync } from "https://deno.land/std@0.55.0/testing/asserts.ts";
import { RouterModule } from "../../../src/modules/router.js";

const sampleRoutes = {
  "home": "/",
  "about": "/about",
  "person": "/person/:id",
  "contacts": "/person/:id/contacts",
  "contact": "/person/:id/contact/:contactId",
};

Deno.test("RouterModule init throws error if routes are not provided", async () => {
  await assertThrowsAsync(
    async () => {
      await RouterModule.init({});
    },
    Error,
    "RouterModule.init: Argument routes is required",
  );
});

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

Deno.test("RouterModule get throws error for invalid route", async () => {
  await RouterModule.init({ routes: sampleRoutes });
  await assertThrowsAsync(
    async () => {
      await RouterModule.get({ route: "invalid" });
    },
    Error,
    "Route not found: invalid",
  );
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

Deno.test("RouterModule.get - should throw an error if route is not found", async () => {
  await RouterModule.init({
    routes: {
      "home": "/",
      "about": "/about",
    },
  });

  await assertThrowsAsync(
    async () => {
      await RouterModule.get({ route: "nonExistentRoute" });
    },
    Error,
    "Route not found: nonExistentRoute",
  );
});

Deno.test("RouterModule.get - should throw an error if a parameter is missing", async () => {
  await RouterModule.init({
    routes: {
      "person": "/person/:id",
    },
  });

  await assertThrowsAsync(
    async () => {
      await RouterModule.get({ route: "person" });
    },
    Error,
    "Missing parameter: id",
  );
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
