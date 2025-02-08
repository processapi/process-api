import {
	assertEquals,
	assertThrowsAsync,
} from "https://deno.land/std@0.55.0/testing/asserts.ts";

import { DomParserModule } from "../../../src/modules/dom-parser.js";

Deno.test("DomParserModule.parse_element - parse text content", () => {
    const mockElement = {
        textContent: "Hello, World!",
    };

    const callbackCalled = false;

    const marker = {
        "tx:__content__": () => callbackCalled = true,
    }

    DomParserModule.parse_element(mockElement, marker);

    assertEquals(callbackCalled, true);
});