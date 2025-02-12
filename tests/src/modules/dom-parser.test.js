import {
	assertEquals,
} from "https://deno.land/std@0.55.0/testing/asserts.ts";

import { DomParserModule } from "../../../src/modules/dom-parser.js";

Deno.test("DomParserModule.parse_element - replace text content marker", () => {
    const mockElement = {
        textContent: "Hello, ${company}!",
    };

    const dictionary = {
        company: "test1",
    };

    DomParserModule.parse_element(mockElement, dictionary);

    assertEquals(mockElement.textContent, "Hello, test1!");
});

Deno.test("DomParserModule.parse_element - replace attribute value marker", () => {
    const mockElement = {
        attributes: [
            { name: "data-company", value: "${company}" }
        ]
    };

    const dictionary = {
        company: "test1",
    };

    DomParserModule.parse_element(mockElement, dictionary);

    assertEquals(mockElement.attributes[0].value, "test1");
});

Deno.test("DomParserModule.parse_element - replace nested dictionary value", () => {
    const mockElement = {
        textContent: "Company name: ${company.name}",
    };

    const dictionary = {
        company: {
            name: "test1",
        },
    };

    DomParserModule.parse_element(mockElement, dictionary);

    assertEquals(mockElement.textContent, "Company name: test1");
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