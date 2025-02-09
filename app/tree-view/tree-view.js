import { ComponentModule } from "../../src/modules/component.js";
import "./../../components/tree-view/tree-view.js";

export default class TreeView extends HTMLElement {
	static tag = "tree-view-view";

	constructor() {
		super();
		this.attachShadow({ mode: "open" });
	}

	async connectedCallback() {
		this.shadowRoot.innerHTML = await api.call("component", "load_html", {
			url: import.meta.url,
		});

        const treeView = this.shadowRoot.querySelector("tree-view");

		ComponentModule.on_ready({
			element: treeView,
			callback: () => {
				treeView.addNodes(null, [
					{ content: "Company 1" },
					{ content: "Company 2" },
					{ content: "Company 3" },
				], "simple-item");
			},
		});
	}

	load(data) {
	}
}

customElements.define(TreeView.tag, TreeView);
