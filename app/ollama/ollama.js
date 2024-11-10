import "./../../components/highlight-memo/highlight-memo.js";
import "./../../components/ollama-ui/ollama-ui.js";

export default class OllamaView extends HTMLElement {
	static tag = "ollama-view";

	constructor() {
		super();
		this.attachShadow({ mode: "open" });
	}

	async connectedCallback() {
		this.shadowRoot.innerHTML = await api.call("component", "load_html", {
			url: import.meta.url,
		});
	}

	load(data) {
	}
}

customElements.define(OllamaView.tag, OllamaView);
