import {ComponentModule} from "../../src/modules/component.js";
import "./../../components/material-icon/material-icon.js";

export default class MaterialIconsView extends HTMLElement {
	static tag = "material-icons-view";

	constructor() {
		super();
		this.attachShadow({ mode: "open" });
	}

	async connectedCallback() {
		this.shadowRoot.innerHTML = await ComponentModule.load_html({
			url: import.meta.url,
		});
	}

	load(data) {
	}
}

customElements.define(MaterialIconsView.tag, MaterialIconsView);
