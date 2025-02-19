import {EventsManager} from "../../src/system/events-manager.js";
import {HTML} from "./bread-crumb.html.js"

class BreadCrumb extends HTMLElement {
    static name = Object.freeze("bread-crumb");

    #eventsManager = new EventsManager();

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = HTML;
    }

    async connectedCallback() {
        this.#eventsManager.addPointerEvent(this, "click", this.#click.bind(this));
    }

    async disconnectedCallback() {
        this.#eventsManager = this.#eventsManager.dispose();
    }

    #click(event) {
        const target = event.composedPath()[0];
        const action = target.dataset.action;

        if (action && this[action]) {
            this[action](event);
        }
    }

    append(dataItem, template = null) {
        
    }
}

customElements.define(AppHeader.name, AppHeader);