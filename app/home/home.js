export default class HomeView extends HTMLElement {
	static tag = "home-view";

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
		console.log(data);
	}
}

customElements.define(HomeView.tag, HomeView);
