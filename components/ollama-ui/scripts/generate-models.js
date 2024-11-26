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
		.map((span) => span.textContent.trim());

	return models;
}

async function getModelDetails(model) {
	const url = `https://ollama.com/library/${model}/tags`;

	const result = {
		url,
		sizes: {},
	};

	const response = await fetch(url);
	const text = await response.text();

	result.tools = text.indexOf("Tools</span>") !== -1;

	const dom = new DOMParser().parseFromString(text, "text/html");

	let tags = dom.querySelector("#primary-tags");
	if (tags == null) {
		tags = dom.querySelector("#secondary-tags");
	}

	for (const element of tags.children) {
		const name = element.children[0].children[0].textContent.trim();
		const size = element.children[1].textContent.trim();

		result.sizes[name] = size;
	}

	return result;
}

async function createModelsData() {
	const models = await getModels();
	const result = {};

	for (const model of models) {
		console.log(`Getting details for model: ${model}`);
		result[model] = await getModelDetails(model);
	}

	return result;
}

const data = await createModelsData();
const modelsFile = "./components/ollama-ui/models.json";
await Deno.writeTextFile(modelsFile, JSON.stringify(data, null, 4));
console.log(JSON.stringify(data, null, 4));
