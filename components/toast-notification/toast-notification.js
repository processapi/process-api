import {ComponentModule} from "../../src/modules/component.js";

export class ToastNotification extends HTMLElement {
    static name = Object.freeze("highlight-memo");

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    async connectedCallback() {
        this.shadowRoot.innerHTML = await ComponentModule.load_html({
            url: import.meta.url,
        });
    }
}

customElements.define(ToastNotification.name, ToastNotification);
