import {ComponentModule} from "../../src/modules/component.js";
import {EventsManager} from "../../src/system/events-manager.js";

class AppHeader extends HTMLElement {
    static name = Object.freeze("app-header");

    #eventsManager = new EventsManager();

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    async connectedCallback() {
        this.shadowRoot.innerHTML = await ComponentModule.load_html({
            url: import.meta.url,
        });

        this.#eventsManager.addPointerEvent(this, "click", this.#click.bind(this));
    }

    #click(event) {
        const target = event.composedPath()[0];
        const action = target.dataset.action;

        if (action && this[action]) {
            this[action](event);
        }
    }

    home() {
        window.location.href = "/";
    }
}

customElements.define(AppHeader.name, AppHeader);