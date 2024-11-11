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
    // const schema = {
    //     body: {
    //         elements: []
    //     }
    // }
    //
    // const divResult = await InputProvider.create({}, "/", {
    //     element: "div"
    // })
    //
    // assert(ValidationResult.isSuccess(divResult));
    // assertExists(schema.body.elements[0])
    // assertEquals(schema.body.elements[0].element, "div");
    //
    // const h1Result = await InputProvider.create({}, "/0/", {
    //     element: "h1",
    //     content: "Hello World"
    // })
    //
    // assert(ValidationResult.isSuccess(h1Result));
    // assertExists(schema.body.elements[0].elements[0])
    // assertEquals(schema.body.elements[0].elements[0].element, "h1");
    // assertEquals(schema.body.elements[0].elements[0].content, "Hello World");
});

Deno.test("InputProvider:update", async () => {

});

Deno.test("InputProvider:delete", async () => {

});

