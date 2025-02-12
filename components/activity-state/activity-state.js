import { ComponentModule } from "../../src/modules/component.js";

class ActivityState extends HTMLElement {
    static name = Object.freeze("activity-state");

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.style.display = "none";
    }

    async connectedCallback() {
        this.shadowRoot.innerHTML = await ComponentModule.load_html({
            url: import.meta.url,
        });

        this.style.display = "block";
    }

    setState(state) {
        const materialIcon = this.shadowRoot.querySelector("material-icon");

        const iconName = {
            "busy": "hourglass_full",
            "success": "check_circle",
            "error": "error",
        }[state];

        ComponentModule.on_ready({
            element: materialIcon,
            callback: () => {
                materialIcon.setIcon(iconName);
            }
        })
    }
}

customElements.define(ActivityState.name, ActivityState);
