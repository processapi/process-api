import { assertEquals, assert } from "https://deno.land/std/testing/asserts.ts";
import { SchemaManager } from "./../../../src/schema/schema-manager.js";
import { ValidationResult } from "./../../../src/schema/validation-result.js";

import { InputProvider } from "../../../src/schema/providers/input.js";

Deno.test("SchemaManager.parse should generate HTML code from schema", async () => {
    const schemaManager = new SchemaManager();
    schemaManager.registerProvider(InputProvider);

    const schemaJson = {
        body: {
            elements: [
                {
                    element: "div",
                    elements: [
                        {
                            "element": "h1",
                            "content": "Hello World"
                        }
                    ]
                }
            ]
        }
    };

    const result = await schemaManager.parse(schemaJson);
    assert(ValidationResult.isSuccess(result));
        assertEquals(result.message, "<div><h1>Hello World</h1></div>");

    schemaManager.dispose();
});

Deno.test("SchemaManager.parse input scenario", async () => {
    const schemaManager = new SchemaManager();
    schemaManager.registerProvider(InputProvider);

    const schemaJson = {
        body: {
            elements: [
                {
                    element: "div",
                    elements: [
                        {
                            "element": "input",
                            "field": "model.firstName",
                            "title": "First Name",
                        }
                    ]
                }
            ]
        }
    };

    const result = await schemaManager.parse(schemaJson);
    assert(ValidationResult.isSuccess(result));

    assert(result.message.indexOf("<input type=\"text\" value.bind=\"model.firstName\" />")) > -1;
    schemaManager.dispose();
});

Deno.test("SchemaManager.validate should validate the entire schema", () => {
    const schemaManager = new SchemaManager();
    const schemaJson = { /* your schema JSON here */ };
    const result = schemaManager.validate(schemaJson);
    assertEquals(result, ValidationResult.success("success"));
    schemaManager.dispose();
});

Deno.test("SchemaManager.validate should validate a part of the schema", () => {
    const schemaManager = new SchemaManager();
    const schemaJson = { /* your schema JSON here */ };
    const path = "some.path";
    const result = schemaManager.validate(schemaJson, path);
    assertEquals(result, ValidationResult.success("success"));
    schemaManager.dispose();
});

Deno.test("SchemaManager.create should create a new element in the schema", () => {
    const schemaManager = new SchemaManager();
    const schemaJson = { /* your schema JSON here */ };
    const path = "some.path";
    const element = { /* your element here */ };
    const result = schemaManager.create(schemaJson, path, element);
    assertEquals(result, ValidationResult.success("success"));
    schemaManager.dispose();
});

Deno.test("SchemaManager.update should update an existing element in the schema", () => {
    const schemaManager = new SchemaManager();
    const schemaJson = { /* your schema JSON here */ };
    const path = "some.path";
    const element = { /* your element here */ };
    const result = schemaManager.update(schemaJson, path, element);
    assertEquals(result, ValidationResult.success("success"));
    schemaManager.dispose();
});

Deno.test("SchemaManager.delete should delete an existing element in the schema", () => {
    const schemaManager = new SchemaManager();
    const schemaJson = { /* your schema JSON here */ };
    const path = "some.path";
    const result = schemaManager.delete(schemaJson, path);
    assertEquals(result, ValidationResult.success("success"));
    schemaManager.dispose();
});