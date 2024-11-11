import {InputProvider} from "../../../../src/schema/providers/input.js";
import {ValidationResult} from "../../../../src/schema/validation-result.js";
import { assertEquals, assert, assertExists } from "https://deno.land/std/testing/asserts.ts";


Deno.test("InputProvider:parse", async () => {

});

Deno.test("InputProvider:validate - valid", async () => {
    const result = await InputProvider.validate({
        field: "firstName",
        title: "First Name",
        placeholder: "Enter your first name"
    }, "path");

    assert(ValidationResult.isSuccess(result));
});

Deno.test("InputProvider:validate - invalid", async () => {
    const result = await InputProvider.validate({
        field: "firstName"
    }, "path");

    assert(ValidationResult.isError(result));
});

Deno.test("InputProvider:create", async () => {
    const schema = {
        body: {
            elements: []
        }
    }

    const result = await InputProvider.create(schema, "/", {
        field: "firstName",
        title: "First Name",
        placeholder: "Enter your first name"
    })

    assert(ValidationResult.isSuccess(result));
    assertExists(schema.body.elements[0])
    assertEquals(schema.body.elements[0].element, "input");
    assertEquals(schema.body.elements[0].field, "firstName");
    assertEquals(schema.body.elements[0].title, "First Name");
});

Deno.test("InputProvider:update", async () => {
    const schema = {
        body: {
            elements: [
                {
                    element: "input",
                    field: "firstName",
                    title: "First Name",
                    placeholder: "Enter your first name"
                }
            ]
        }
    }

    const result = await InputProvider.update(schema, "/0", {
        field: "lastName",
        title: "Last Name",
        placeholder: "Enter your last name"
    })

    assert(ValidationResult.isSuccess(result));
    assertExists(schema.body.elements[0])
    assertEquals(schema.body.elements[0].element, "input");
    assertEquals(schema.body.elements[0].field, "lastName");
    assertEquals(schema.body.elements[0].title, "Last Name");
    assertEquals(schema.body.elements[0].placeholder, "Enter your last name");
});

Deno.test("InputProvider:delete", async () => {

});

