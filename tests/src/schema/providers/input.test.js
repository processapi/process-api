import {InputProvider} from "../../../../src/schema/providers/input.js";
import {ValidationResult} from "../../../../src/schema/validation-result.js";
import { assertEquals, assert } from "https://deno.land/std/testing/asserts.ts";


Deno.test("InputProvider:parse", async () => {

});

Deno.test("InputProvider:validate - valid", async () => {
    const result = await InputProvider.validate({
        field: "firstName",
        title: "First Name"
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

});

Deno.test("InputProvider:update", async () => {

});

Deno.test("InputProvider:delete", async () => {

});

