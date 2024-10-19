import { validateArgs } from './../../../src/validate/validate-args.js';
import { assertEquals, assertThrows } from "https://deno.land/std@0.55.0/testing/asserts.ts";

Deno.test("validateArgs - should throw an error if arguments are not provided", () => {
    assertThrows(
        () => validateArgs(null, { view: { type: 'string', required: true } }, "Test: "),
        Error,
        "Test: Arguments are required"
    );
});

Deno.test("validateArgs - should throw an error if required argument is missing", () => {
    assertThrows(
        () => validateArgs({}, { view: { type: 'string', required: true } }, "Test: "),
        Error,
        "Test: Argument view is required"
    );
});

Deno.test("validateArgs - should throw an error if argument type is incorrect", () => {
    assertThrows(
        () => validateArgs({ view: 123 }, { view: { type: 'string', required: true } }, "Test: "),
        Error,
        "Test: Argument view should be of type string"
    );
});

Deno.test("validateArgs - should set default value if argument is not provided", () => {
    const args = {};
    const def = { data: { type: 'object', default: {} } };
    validateArgs(args, def, "Test: ");
    assertEquals(args.data, {});
});

Deno.test("validateArgs - should not throw an error if valid arguments are provided", () => {
    const args = { view: 'home', data: {} };
    const def = { view: { type: 'string', required: true }, data: { type: 'object', default: {} } };
    validateArgs(args, def, "Test: ");
    assertEquals(args.view, 'home');
    assertEquals(args.data, {});
});