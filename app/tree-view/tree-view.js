import { ComponentModule } from "../../src/modules/component.js";
import "./../../components/tree-view/tree-view.js";
import { EventsManager } from "../../src/system/events-manager.js";

export default class TreeView extends HTMLElement {
	static tag = "tree-view-view";

	#eventsManager = new EventsManager();

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

				this.#eventsManager.addEvent(treeView, "expanded", this.#expanded.bind(this));
			},
		});
	}

	disconnectedCallback() {
		this.#eventsManager.dispose();
	}

	#expanded(event) {
		const { treeView, node, doneCallback } = event.detail;

		treeView.addNodes(node, [
			{ content: "Department 1", _hasChildren: true },
			{ content: "Department 2", _hasChildren: false },
			{ content: "Department 3", _hasChildren: false },
		]);

		doneCallback();
	}
}

customElements.define(TreeView.tag, TreeView);
