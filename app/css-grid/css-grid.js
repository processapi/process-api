import "./../../components/ollama-ui/ollama-ui.js";

export default class CSSGridView extends HTMLElement {
    static tag = "cssgrid-view";

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

customElements.define(CSSGridView.tag, CSSGridView);
