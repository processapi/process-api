export default class AboutView extends HTMLElement {
	static tag = "about-view";

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

customElements.define(AboutView.tag, AboutView);
