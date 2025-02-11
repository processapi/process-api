import "./../../components/menu/menu-container/menu-container.js";

export default class MainMenuView extends HTMLElement {
	static tag = "main-menu-view";

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

customElements.define(MainMenuView.tag, MainMenuView);
