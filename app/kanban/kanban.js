import "./../../components/kanban/kanban.js";
import {ComponentModule} from "../../src/modules/component.js";
import {generateRecords} from "./data.js";

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

        const kanban = this.shadowRoot.querySelector("kanban-component");
        await ComponentModule.on_ready({ element: kanban, callback: () => {
            const data = generateRecords(10000, 50);
            kanban.setData(data, "staff", "status");
        }});
    }

    load(data) {
    }
}

customElements.define(KanbanView.tag, KanbanView);