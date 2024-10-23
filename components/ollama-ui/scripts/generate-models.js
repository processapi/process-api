/**
 * This is a deno script that generates a models json from by scraping the Ollama website.
 */

import { DOMParser, Element } from "jsr:@b-fuze/deno-dom";

async function getModels() {
    const url = "https://ollama.com/library";
    const response = await fetch(url);
    const text = await response.text();
    const dom = new DOMParser().parseFromString(text, "text/html");
    const models = Array.from(dom.querySelectorAll(".truncate span"))
        .map(span => span.textContent.trim());

    return models;
}

console.log(JSON.stringify(await getModels(), null, 2));