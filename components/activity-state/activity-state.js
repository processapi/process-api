import { ComponentModule } from "../../src/modules/component.js";

class ActivityState extends HTMLElement {
    static name = Object.freeze("activity-state");

    #state;

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.style.display = "none";
    }

    async connectedCallback() {
        this.shadowRoot.innerHTML = await ComponentModule.load_html({
            url: import.meta.url,
        });

        requestAnimationFrame(() => {
            if (this.#state) {
                this.setState(this.#state);
            }
            this.style.display = "block";
        });
    }

    setState(state) {
        const materialIcon = this.shadowRoot.querySelector("material-icon");

        if (materialIcon == null) {
            this.#state = state;
            return;
        }

        const iconName = {
            "busy"      : "progress_activity",
            "success"   : "check",
            "error"     : "error_outline",
        }[state];

        ComponentModule.on_ready({
            element: materialIcon,
            callback: () => {
                materialIcon.setIcon(iconName);
                materialIcon.classList.remove("success", "error", "rotate");

                if (state === "busy") {
                    materialIcon.classList.add("rotate");
                } else if (state === "success") {
                    materialIcon.classList.add("success");
                } else if (state === "error") {
                    materialIcon.classList.add("error");
                }
            }
        })
    }
}

customElements.define(ActivityState.name, ActivityState);
