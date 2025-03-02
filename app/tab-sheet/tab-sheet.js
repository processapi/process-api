import "./../../components/tab-sheet/tab-sheet.js";

export default class TabSheetView extends HTMLElement {
	static tag = "tab-sheet-view";

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

customElements.define(TabSheetView.tag, TabSheetView);
