import "./../../components/toast-notification/toast-notification.js";
import { FormModule } from "./../../src/modules/form.js";
import "./../../components/dynamic-columns/dynamic-columns.js";
import "./../../components/virtual-list/virtual-list.js";

export default class FormView extends HTMLElement {
	static tag = "form-view";

	#clickHandler = this.#click.bind(this);

	constructor() {
		super();
		this.attachShadow({ mode: "open" });
	}

	async connectedCallback() {
		this.shadowRoot.innerHTML = await api.call("component", "load_html", {
			url: import.meta.url,
		});

		this.shadowRoot.addEventListener("click", this.#clickHandler);
	}

	async disconnectedCallback() {
		this.shadowRoot.removeEventListener("click", this.#clickHandler);
		this.#clickHandler = null;
	}

    load(data) {
    }

	async #click(event) {
		const target = event.target;
		
		if (target.dataset.action) {
			this[target.dataset.action]();
		}
	}

	error() {
		toastNotification.error("Something bad happened");
	}

	info() {
		toastNotification.info("Something interesting happened");
	}

	success() {
		toastNotification.success("Something good happened");
	}

	warning() {
		toastNotification.warning("Something not so good happened");
	}

	populate() {
		const form = this.shadowRoot.querySelector("form");
		const data = {
			personName: "John",
			personAge: 20,
			personEmail: "john@gmail.com"
		};

		FormModule.to({ form, data });
	}

	print() {
		const form = this.shadowRoot.querySelector("form");
		const data = FormModule.from({ form });
		toastNotification.info(JSON.stringify(data, null, 2));
	}
}

customElements.define(FormView.tag, FormView);