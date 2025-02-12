export default class ActivityStateView extends HTMLElement {
	static tag = "activity-state-view";

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

customElements.define(ActivityStateView.tag, ActivityStateView);
