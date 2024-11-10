import {assertEquals} from "https://deno.land/std@0.55.0/testing/asserts.ts";

import {MarkdownModule} from "../../../src/modules/markdown.js";

Deno.test("MarkdownModule.to_html - should convert markdown to html", async () => {
    const html = await MarkdownModule.to_html({markdown: "# Hello, World!"});
    assertEquals(html, "<h1>Hello, World!</h1>\n");
});