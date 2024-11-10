import { ComponentModule } from "../../src/modules/component.js";
import { OllamaModule } from "../../src/modules/ollama.js";
import { FilesModule } from "../../src/modules/files.js";
import { LocalStorageKeys } from "./ollama-settings/ollama-settings.js";

const TRANSLATION_MAP = {
	"placeholder": "input:placeholder",
	"run-hint": "#btnRun:title",
	"attach-hint": "#btnAttach:title",
	"settings-hint": "#btnSettings:title",
};

/**
 * @class OllamaUIComponent
 * @description A web component that provides a user interface for interacting with the Ollama API
 */
export class OllamaUIComponent extends HTMLElement {
	static name = Object.freeze("ollama-ui");

	#btnAttachClickHandler = this.#btnAttachClick.bind(this);
	#btnRunClickHandler = this.#btnRunClick.bind(this);
	#btnSettingsClickHandler = this.#btnSettingsClick.bind(this);
	#enterHandler = this.#enter.bind(this);
	#resultElement;
	#messages = [];
	#sanitizeHandler = this.#sanitize.bind(this);
	#embeddings;

	#options = {
		model: "llama3.2",
		embeddingsModel: "mxbai-embed-large",
	};

	constructor() {
		super();
		this.attachShadow({ mode: "open" });
	}

	/**
	 * @method connectedCallback
	 * @description Called when the component is connected to the DOM
	 * @returns {Promise<void>}
	 */
	async connectedCallback() {
		this.shadowRoot.innerHTML = await ComponentModule.load_html({
			url: import.meta.url,
		});

		this.#resultElement = this.shadowRoot.querySelector(".result");

		if (!await OllamaModule.is_active()) {
			return showOllamaNotActive();
		}

		manageClickEvents(
			this.shadowRoot,
			"addEventListener",
			this.#btnAttachClickHandler,
			this.#btnRunClickHandler,
			this.#btnSettingsClickHandler,
		);

		this.shadowRoot.querySelector(".input-text").addEventListener("keydown", this.#enterHandler);
	}

	/**
	 * @method disconnectedCallback
	 * @description Called when the component is disconnected from the DOM
	 * @returns {Promise<void>}
	 */
	async disconnectedCallback() {
		manageClickEvents(
			this.shadowRoot,
			"removeEventListener",
			this.#btnAttachClickHandler,
			this.#btnRunClickHandler,
			this.#btnSettingsClickHandler,
		);

		this.shadowRoot.querySelector(".input-text").removeEventListener("keydown", this.#enterHandler);

		this.#btnAttachClickHandler = null;
		this.#btnRunClickHandler = null;
		this.#btnSettingsClickHandler = null;
		this.#resultElement = null;
		this.#sanitizeHandler = null;
	}

	/**
	 * @method #btnAttachClick
	 * @description Event handler for the attach button click event
	 * @returns {Promise<void>}
	 */
	async #btnAttachClick() {
		const files = await FilesModule.load_files({ ext: ".txt" });
		const file = files[0];
		const text = await file.text();

		const embedModel =
			localStorage.getItem(LocalStorageKeys.EMBEDDING_MODEL) ||
			localStorage.getItem(LocalStorageKeys.CHAT_MODEL) ||
			localStorage.getItem(LocalStorageKeys.GENERATE_MODEL);

		const embeddingsResult = await OllamaModule.embed({
			model: embedModel,
			input: text,
		});

		this.#embeddings = embeddingsResult.embeddings;
	}

	/**
	 * @method #btnRunClick
	 * @description Event handler for the run button click event
	 * @returns {Promise<void>}
	 */
	async #btnRunClick() {
		const action = localStorage.getItem(LocalStorageKeys.INTERACT_TYPE) === "true" ? "chat" : "generate";
		const inputElement = this.shadowRoot.querySelector(".input-text");
		const text = inputElement.value;
		inputElement.value = "";

		await this[action](text);
	}

	/**
	 * @method #btnSettingsClick
	 * @description Event handler for the settings button click event
	 */
	#btnSettingsClick() {
		document.body.appendChild(document.createElement("ollama-settings"));
	}

	/**
	 * @method #enter
	 * @description Event handler for the enter key press event
	 * @param event
	 * @returns {Promise<void>}
	 */
	async #enter(event) {
		if (event.key === "Enter") {
			await this.#btnRunClick();
		}
	}

	/**
	 * @method #sanitize
	 * @param text
	 * @returns {*}
	 */
	#sanitize(text) {
		// 1. replace \n with <br>
		// 2. replace \t with &nbsp;&nbsp;&nbsp;&nbsp;
		// 3. replace \s with &nbsp;
		return text
			.replace(/\n/g, "<br>")
			.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;")
			.replace(/\s/g, "&nbsp;")
	}

	/**
	 * Sets the translations for the component
	 * {
	 *     "placeholder"    : "Enter your text here",
	 *     "run-hint"       : "Run",
	 *     "attach-hint"    : "Attach a file",
	 *     "settings-hint"  : "Settings"
	 * }
	 * @param options {Object} - Define options for the component such as model to use, translations etc.
	 * @returns {void}
	 */
	setOptions(options) {
		this.#options = options;

		if (options.translations != null) {
			setTranslations(this.shadowRoot, options.translations);
		}
	}

	/**
	 * @method chat
	 * @description Chat with the assistant
	 * @param text
	 * @returns {Promise<void>}
	 */
	async chat(text) {
		const systemPrompt = localStorage.getItem("systemPrompt") ?? "You are a cheerful but professional assistant.";

		if (this.#messages.length === 0) {
			this.#messages.push({ role: "system", content: systemPrompt });
		}

		const model = localStorage.getItem(LocalStorageKeys.CHAT_MODEL);
		this.#messages.push({ role: "user", content: text });

		const result = OllamaModule.chat({
			model,
			messages: this.#messages,
			stream: true
		})

		const resultElement = document.createElement("p");
		this.#resultElement.appendChild(resultElement);

		const response = [];
		await streamResult(result, this.#resultElement, this.#sanitizeHandler, response);
		this.#messages.push({ role: "assistant", content: response.join(" ") });
	}

	/**
	 * @method generate
	 * @description Generate a response to the given text
	 * @param text
	 * @returns {Promise<void>}
	 */
	async generate(text) {
		const model = localStorage.getItem(LocalStorageKeys.GENERATE_MODEL);

		if (this.#embeddings != null) {
			text = `Using this data: {${this.#embeddings}}. Respond to this prompt: {${text}}`;
		}

		const result = await OllamaModule.generate({
			model,
			prompt: text,
			stream: true,
			system: localStorage.getItem("systemPrompt") ?? "",
		});

		const resultElement = document.createElement("p");
		this.#resultElement.appendChild(resultElement);
		await streamResult(result, this.#resultElement, this.#sanitizeHandler);
	}
}

/**
 * @function streamResult
 * @description Stream the result of a request to the result
 * @param result - The result of the request
 * @param resultElement - The element to append the result to
 * @param sanitize - The function to sanitize the result
 * @param responseCollection - The collection to store the responses in
 * @returns {Promise<void>}
 */
async function streamResult(result, resultElement, sanitize, responseCollection) {
	for await (const message of result) {
		const json = JSON.parse(message.trim().replace(/[\x00-\x1F\x7F-\x9F]/g, ""));

		if (json.error != null) {
			resultElement.innerHTML += `<error>ERROR: ${json.error}</error>`;
			return;
		}

		const text = sanitize(json.message?.content ?? json.response);

		if (responseCollection != null) {
			responseCollection?.push(json.message.content);
		}

		requestAnimationFrame(() => {
			resultElement.innerHTML += text;
			resultElement.scrollTop = resultElement.scrollHeight;
		})
	}

	resultElement.scrollTop = resultElement.scrollHeight;
}

function manageClickEvents(
	shadowRoot,
	action,
	attachHandler,
	runHandler,
	settingsHandler,
) {
	shadowRoot.querySelector("#btnAttach")[action]("click", attachHandler);
	shadowRoot.querySelector("#btnRun")[action]("click", runHandler);
	shadowRoot.querySelector("#btnSettings")[action]("click", settingsHandler);
}

function setTranslations(shadowRoot, translations) {
	for (const key of Object.keys(translations)) {
		if (TRANSLATION_MAP[key]) {
			const parts = TRANSLATION_MAP[key].split(":");
			shadowRoot.querySelector(`${parts[0]}`).setAttribute(
				parts[1],
				dictionary[key],
			);
		}
	}
}

function showOllamaNotActive() {
	import ("./ollama-active/ollama-active.js").then(() => {
		const instance = document.createElement("ollama-active");
		document.body.appendChild(instance);
	});
}

customElements.define(OllamaUIComponent.name, OllamaUIComponent);
