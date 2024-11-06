import { ComponentModule } from "../../src/modules/component.js";
import { OllamaModule } from "../../src/modules/ollama.js";
import { LocalStorageKeys } from "./ollama-settings/ollama-settings.js";

const TRANSLATION_MAP = {
	"placeholder": "input:placeholder",
	"run-hint": "#btnRun:title",
	"attach-hint": "#btnAttach:title",
	"settings-hint": "#btnSettings:title",
};

export class OllamaUIComponent extends HTMLElement {
	static name = Object.freeze("ollama-ui");

	#btnAttachClickHandler = this.#btnAttachClick.bind(this);
	#btnRunClickHandler = this.#btnRunClick.bind(this);
	#btnSettingsClickHandler = this.#btnSettingsClick.bind(this);
	#enterHandler = this.#enter.bind(this);
	#resultElement;
	#messages = [];
	#sanitizeHandler = this.#sanitize.bind(this);

	#options = {
		model: "llama3.2",
		embeddingsModel: "mxbai-embed-large",
	};

	constructor() {
		super();
		this.attachShadow({ mode: "open" });
	}

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

	#btnAttachClick() {
		console.log("Attach clicked");
	}

	async #btnRunClick() {
		const action = localStorage.getItem(LocalStorageKeys.INTERACT_TYPE) === "true" ? "chat" : "generate";
		const inputElement = this.shadowRoot.querySelector(".input-text");
		const text = inputElement.value;
		inputElement.value = "";

		await this[action](text);
	}

	#btnSettingsClick() {
		document.body.appendChild(document.createElement("ollama-settings"));
	}

	async #enter(event) {
		if (event.key === "Enter") {
			await this.#btnRunClick();
		}
	}

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

	async chat(text) {
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

	async generate(text) {
		const model = localStorage.getItem(LocalStorageKeys.GENERATE_MODEL);

		const result = await OllamaModule.generate({
			model,
			prompt: text,
			stream: true,
		});

		const resultElement = document.createElement("p");
		this.#resultElement.appendChild(resultElement);
		await streamResult(result, this.#resultElement, this.#sanitizeHandler);
	}
}

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
