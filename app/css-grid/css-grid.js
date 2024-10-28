import "./../../components/ollama-ui/ollama-ui.js";
import {CssGridModule} from "./../../src/modules/css-grid.js";

export default class CSSGridView extends HTMLElement {
    static tag = "cssgrid-view";
    #clickHandler = this.#click.bind(this);

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    async connectedCallback() {
        this.shadowRoot.innerHTML = await api.call("component", "load_html", {
            url: import.meta.url,
        });

        this.addEventListener("click", this.#clickHandler);
    }

    async disconnectedCallback() {
        this.removeEventListener("click", this.#clickHandler);
        this.#clickHandler = null;
    }

    load(data) {
    }

    async #click(event) {
        const target = event.composedPath()[0];

        if (target.dataset.action != null) {
            if (this[target.dataset.action] != null) {
                await this[target.dataset.action]()
            }
        }
    }

    async add3Columns() {
        const data = await CssGridModule.create({
            columnCount: 3
        })

        const element = this.shadowRoot.querySelector(".grid");
        element.innerHTML = "";

        await CssGridModule.apply({data, element});
    }

    async add3All() {
        const data = await CssGridModule.create({
            columnCount: 3,
            rowCount: 3
        })

        const element = this.shadowRoot.querySelector(".grid");
        element.innerHTML = "";

        await CssGridModule.apply({data, element});
    }
}

customElements.define(CSSGridView.tag, CSSGridView);
