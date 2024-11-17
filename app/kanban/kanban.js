import "./../../components/kanban/kanban.js";

export default class KanbanView extends HTMLElement {
    static tag = "kanban-view";

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

customElements.define(KanbanView.tag, KanbanView);