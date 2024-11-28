import "./../../components/dynamic-columns/dynamic-columns.js";
import "./../../components/dynamic-rows/dynamic-rows.js";

export default class DynamicView extends HTMLElement {
    static tag = "dynamic-view";

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    async connectedCallback() {
        this.shadowRoot.innerHTML = await api.call("component", "load_html", {
            url: import.meta.url,
        });
    }

    load(data) {
    }
}

customElements.define(DynamicView.tag, DynamicView);
