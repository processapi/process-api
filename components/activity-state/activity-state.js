import { ComponentModule } from "../../src/modules/component.js";
import { HTML } from "./activity-state.html.js";

/**
 * Class representing the activity state component.
 * @extends HTMLElement
 */
class ActivityState extends HTMLElement {
    static name = Object.freeze("activity-state");

    #state;

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = HTML;
    }

    /**
     * Called when the element is connected to the document's DOM.
     */
    async connectedCallback() {
        if (this.#state) {
            this.setState(this.#state);
        }
    }

    /**
     * Sets the state of the activity.
     * @param {string} state - The state to set ('busy', 'success', 'error').
     */
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
            "warning"   : "warning_amber"
        }[state];

        ComponentModule.on_ready({
            element: materialIcon,
            callback: () => {
                materialIcon.setIcon(iconName);
                materialIcon.classList.remove("success", "error", "rotate", "warning");

                if (state === "busy") {
                    materialIcon.classList.add("rotate");
                } else if (state === "success") {
                    materialIcon.classList.add("success");
                } else if (state === "error") {
                    materialIcon.classList.add("error");
                } else if (state === "warning") {
                    materialIcon.classList.add("warning");
                }
            }
        })
    }
}

customElements.define(ActivityState.name, ActivityState);
