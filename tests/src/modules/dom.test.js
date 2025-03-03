import { assertEquals } from "jsr:@std/assert";
import { DomModule } from "../../../src/modules/dom.js";

// Mock the DOM environment
globalThis.document = {
    createElement: (tagName) => {
        return {
            innerHTML: "",
            style: {},
            appendChild: () => {},
            cloneNode: () => ({
                innerHTML: "",
                style: {},
                appendChild: () => {},
                getBoundingClientRect: () => ({ height: 100 })
            }),
            getBoundingClientRect: () => ({ height: 100 }),
            clientHeight: 100,
            clientWidth: 50
        };
    },
    body: {
        appendChild: () => {},
        removeChild: () => {}
    }
};

Deno.test("DomModule.measure_template should return the height of a template", async () => {
    const template = document.createElement("template");
    template.innerHTML = "<div style='height: 100px'></div>";

    const size = await DomModule.measure_template(template);
    assertEquals(size.width, 50);
    assertEquals(size.height, 100);
});