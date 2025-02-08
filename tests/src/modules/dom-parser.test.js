import {
	assertEquals,
	assertThrowsAsync,
} from "https://deno.land/std@0.55.0/testing/asserts.ts";

import { DomParserModule } from "../../../src/modules/dom-parser.js";

Deno.test("DomParserModule.parse_element - parse text content", () => {
    const mockElement = {
        textContent: "Hello, World!",
    };

    let callbackCalled = false;

    const marker = {
        "tc:World": () => callbackCalled = true,
    }

    DomParserModule.parse_element(mockElement, marker);

    assertEquals(callbackCalled, true);
});

Deno.test("DomParserModule.parse_element - parse attribute name", () => {
    const mockElement = {
        attributes: [
            { name: "data-bind", value: "value" }
        ]
    };

    let callbackCalled = false;

    const marker = {
        "an:bind": () => callbackCalled = true,
    }

    DomParserModule.parse_element(mockElement, marker);

    assertEquals(callbackCalled, true);
});

Deno.test("DomParserModule.parse_element - parse attribute value", () => {
    const mockElement = {
        attributes: [
            { name: "data-hidden", value: "true" }
        ]
    };

    let callbackCalled = false;

    const marker = {
        "av:true": () => callbackCalled = true,
    }

    DomParserModule.parse_element(mockElement, marker);

    assertEquals(callbackCalled, true);
});

Deno.test("DomParserModule.parse_element - parse child elements", () => {
    const mockElement = {
        children: [
            { textContent: "Child element" }
        ]
    };

    let callbackCalled = false;

    const marker = {
        "tc:Child": () => callbackCalled = true,
    }

    DomParserModule.parse_element(mockElement, marker);

    assertEquals(callbackCalled, true);
});

Deno.test("DomParserModule.parse_element - no markers", () => {
    const mockElement = {
        textContent: "Hello, World!",
    };

    const marker = {};

    DomParserModule.parse_element(mockElement, marker);

    // No assertion needed, just ensure no errors are thrown
});

Deno.test("DomParserModule.parse_element - null values", () => {
    const mockElement = null;
    const marker = null;

    DomParserModule.parse_element(mockElement, marker);

    // No assertion needed, just ensure no errors are thrown
});

Deno.test("DomParserModule.parse_element - nested child elements", () => {
    const mockElement = {
        children: [
            {
                textContent: "Parent element",
                children: [
                    { textContent: "Child element" }
                ]
            }
        ]
    };

    let callbackCalled = false;

    const marker = {
        "tc:Child": () => callbackCalled = true,
    }

    DomParserModule.parse_element(mockElement, marker);

    assertEquals(callbackCalled, true);
});