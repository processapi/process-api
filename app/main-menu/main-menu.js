import { EventsManager } from "../../src/system/events-manager.js";
import "./../../components/menu/menu-container/menu-container.js";
import "./../../components/toast-notification/toast-notification.js";

export default class MainMenuView extends HTMLElement {
	static tag = "main-menu-view";

	#eventsManager = new EventsManager();

	constructor() {
		super();
		this.attachShadow({ mode: "open" });
	}

	async connectedCallback() {
		this.shadowRoot.innerHTML = await api.call("component", "load_html", {
			url: import.meta.url,
		});

		requestAnimationFrame(() => {
			const menu = this.shadowRoot.querySelector("#main-menu");
			this.#eventsManager.addEvent(menu, "selected", this.#menuSelected.bind(this));
		})
	}

	async disconnectedCallback() {
		this.#eventsManager = this.#eventsManager.dispose();
	}

	#menuSelected(event) {
		const { detail } = event;
		toastNotification.info(`Selected: ${detail}`);
	}
}

customElements.define(MainMenuView.tag, MainMenuView);
