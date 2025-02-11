export class MaterialIcon extends HTMLElement {
    static name = Object.freeze("material-icon");

    /**
     * Constructor attaches a shadow root.
     */
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.style.display = "hidden";
    }

    /**
     * Loads HTML content and attaches click handler.
     */
    async connectedCallback() {
        this.setIcon(this.getAttribute("icon"));
        this.style.display = "flex";
        this.style.alignItems = "center";
        this.style.justifyContent = "center";
    }

    setIcon(iconName) {
        const url = new URL(`./icons/${iconName}.svg`, import.meta.url);

        fetch(url)
            .then(response => response.text())
            .then(svg => {
                this.shadowRoot.innerHTML = svg;
            })
            .catch(error => {
                console.error(`Error loading icon: ${error}`);
            });
    }
}

customElements.define(MaterialIcon.name, MaterialIcon);