import {ComponentModule} from "../../src/modules/component.js";
import "./../../components/material-icon/material-icon.js";
import {icons} from "./icons.js";
import { EventsManager } from "../../src/system/events-manager.js";
import {IdleModule} from "./../../src/modules/idle.js";

export default class MaterialIconsView extends HTMLElement {
	static tag = "material-icons-view";

	#eventsManager = new EventsManager();

	constructor() {
		super();
		this.attachShadow({ mode: "open" });
	}

	async connectedCallback() {
		this.shadowRoot.innerHTML = await ComponentModule.load_html({
			url: import.meta.url,
		});

		IdleModule.perform({tasks: [this.#createIcons.bind(this)]});
		this.#setupSearch();
	}

	dispose() {
		this.#eventsManager = this.#eventsManager.dispose();
	}

	#createIcons() {
		const template = this.shadowRoot.querySelector("template");

		const fragment = document.createDocumentFragment();
		for (const icon of icons) {
			const instance = template.content.cloneNode(true);

			const materialIcon = instance.querySelector("material-icon");
			materialIcon.setAttribute("icon", icon);

			instance.firstElementChild.title = icon;

			fragment.appendChild(instance);
		}
		this.shadowRoot.querySelector(".icons").appendChild(fragment);
	}

	#setupSearch() {
		const searchInput = this.shadowRoot.querySelector(`[type="search"]`);
		this.#eventsManager.addEvent(searchInput, "input", this.#search.bind(this));
	}

	#search(event) {
		const search = event.target.value.toLowerCase();
		const icons = this.shadowRoot.querySelectorAll("material-icon");
		for (const icon of icons) {
			const iconText = icon.getAttribute("icon").toLowerCase();
			if (iconText.includes(search)) {
				icon.parentElement.style.display = "block";
			} else {
				icon.parentElement.style.display = "none";
			}
		}
	}
}

customElements.define(MaterialIconsView.tag, MaterialIconsView);
