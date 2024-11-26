import "./../../components/dynamic-columns/dynamic-columns.js";

export default class DynamicColumnsView extends HTMLElement {
    static tag = "dynamic-columns-view";

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

customElements.define(DynamicColumnsView.tag, DynamicColumnsView);
