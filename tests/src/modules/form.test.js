import { assertEquals, assert } from "jsr:@std/assert";
import { FormModule } from "../../../src/modules/form.js";

// Mocking DOM features
globalThis.document = {
    elements: {},
    createElement: (tagName) => {
        const element = {
            tagName,
            name: "",
            value: "",
            appendChild: (child) => {
                globalThis.document.elements[child.name] = child;
            },
            querySelector: (selector) => {
                const name = selector.match(/\[name="(.+)"\]/)[1];
                return globalThis.document.elements[name] || { name, value: "" };
            },
            reset: () => {
                Object.values(globalThis.document.elements).forEach(element => {
                    element.value = "";
                });
            },
            submit: () => {
                const event = new Event("submit", { bubbles: true, cancelable: true });
                form.dispatchEvent(event);
            }
        };
        return element;
    }
};

globalThis.FormData = class {
    constructor(form) {
        this.data = form?.data || {};
    }
    append(name, value) {
        this.data[name] = value;
    }
    get(name) {
        return this.data[name];
    }
    entries() {
        return Object.entries(this.data);
    }
};

Deno.test("FormModule.from should create a dictionary from form elements", () => {
    const form = new FormData();
    form.append("name", "John");
    form.append("age", "30");

    const result = FormModule.from({ form });
    assertEquals(result.name, "John");
    assertEquals(result.age, "30");
});

Deno.test("FormModule.to should populate form elements with data from a dictionary", () => {
    const form = document.createElement("form");
    const inputName = document.createElement("input");
    inputName.name = "name";
    form.appendChild(inputName);

    const inputAge = document.createElement("input");
    inputAge.name = "age";
    form.appendChild(inputAge);

    const data = { name: "John", age: "30" };
    FormModule.to({ form, data });

    assertEquals(inputName.value, "John");
    assertEquals(inputAge.value, "30");
});

Deno.test("FormModule.set should set a specific form element's value", () => {
    const form = document.createElement("form");
    const inputName = document.createElement("input");
    inputName.name = "name";
    form.appendChild(inputName);

    FormModule.set({ form, property: "name", value: "John" });
    assertEquals(inputName.value, "John");
});

Deno.test("FormModule.clear should clear the form elements", () => {
    const form = document.createElement("form");
    const inputName = document.createElement("input");
    inputName.name = "name";
    inputName.value = "John";
    form.appendChild(inputName);

    FormModule.clear({ form });
    assertEquals(inputName.value, "");
});

