import {ComponentModule} from "../../src/modules/component.js";

class DynamicColumns extends HTMLElement {
    static name = Object.freeze("dynamic-columns");

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    async connectedCallback() {
        this.shadowRoot.innerHTML = await ComponentModule.load_html({
            url: import.meta.url,
        });

        const columns = this.getAttribute("columns");
        this.style.setProperty("--columns", columns ?? "1fr 1fr");

        requestAnimationFrame(() => {
            createResizeHandles(this);
        })
    }
}

function createResizeHandles(component) {
    const styles = getComputedStyle(component);
    const columns = styles.gridTemplateColumns.split(" ");
    const columnCount = columns.length;

    let x = 0;

    for (let i = 0; i < columnCount - 1; i++) {
        x += parseFloat(columns[i].replace("px", ""));

        const handle = document.createElement("div");
        handle.classList.add("resize-handle");
        handle.style.translate = `${x}px 0`;
        component.shadowRoot.appendChild(handle);

        x += parseFloat(styles.gap.replace("px", ""));
    }
}

customElements.define(DynamicColumns.name, DynamicColumns);