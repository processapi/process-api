class DividerItem extends HTMLElement {
    static name = Object.freeze("divider-item");

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.style.display = "block";
        this.style.height = "1px";
        this.style.backgroundColor = "var(--cl-border)";
        this.style.padding = 0;
        this.style.border = "none";
        this.boxSizing = "border-box";
    }
}

customElements.define(DividerItem.name, DividerItem);
