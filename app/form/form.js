
export default class FormView extends HTMLElement {
	static tag = "form-view";

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

customElements.define(FormView.tag, FormView);