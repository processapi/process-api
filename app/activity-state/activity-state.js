import "./../../components/tool-bar/tool-bar.js";
import "./../../components/activity-state/activity-state.js";
import { EventsManager } from "../../src/system/events-manager.js";

export default class ActivityStateView extends HTMLElement {
	static tag = "activity-state-view";

	#eventsManager = new EventsManager(this);

	constructor() {
		super();
		this.attachShadow({ mode: "open" });		
	}

	async connectedCallback() {
		this.shadowRoot.innerHTML = await api.call("component", "load_html", {
			url: import.meta.url,
		});

		this.setState(this.dataset.state ?? "busy");

		this.#eventsManager.addEvent(this, "click", this.#click.bind(this));
	}

	disconnectedCallback() {
		this.#eventsManager = this.#eventsManager.dispose();
	}

	#click(event) {
		if (event.target.dataset.action) {
			this.setState("busy");
		}
	}

	setState(state) {
		requestAnimationFrame(() => {
			const activityState = this.shadowRoot.querySelector("activity-state");
			activityState.dataset.state = state;
		});
	}
}

customElements.define(ActivityStateView.tag, ActivityStateView);
