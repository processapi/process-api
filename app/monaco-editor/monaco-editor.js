import "./../../components/monaco-editor/monaco-editor.js";

export default class MonacoEditorView extends HTMLElement {
	static tag = "monaco-editor-view";

	constructor() {
		super();
		this.attachShadow({ mode: "open" });
	}

	async connectedCallback() {
		this.shadowRoot.innerHTML = await api.call("component", "load_html", {
			url: import.meta.url,
		});
	}
}

customElements.define(MonacoEditorView.tag, MonacoEditorView);
