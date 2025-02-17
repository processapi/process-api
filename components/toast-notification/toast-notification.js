import { HTML } from "./toast-notification.html.js";

/**
 * The ToastNotification web component handles creating and displaying toasts.
 */
export class ToastNotification extends HTMLElement {
    static name = Object.freeze("toast-notification");

    #clickHandler = this.#click.bind(this);

    get duration() {
        return parseInt(this.getAttribute("duration")) || 3000;
    }

    /**
     * Constructor attaches a shadow root.
     */
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = HTML;
    }

    /**
     * Loads HTML content and attaches click handler.
     */
    async connectedCallback() {
        this.addEventListener("click", this.#clickHandler);
    }

    /**
     * Removes click handler on disconnect.
     */
    disconnectedCallback() {
        this.removeEventListener("click", this.#clickHandler);
    }

    /**
     * Checks whether user clicked the close icon and removes the toast if so.
     */
    #click(event) {
        const target = event.composedPath()[0];
        if (target.matches(".close")) {
            target.closest(".toast").remove();
        }
    }

    /**
     * Clones a template, sets the message, and appends it to the toast container.
     * @param {string} id - The template ID.
     * @param {string} message - The message to display in the toast.
     */
    #showTemplate(id, message) {
        const template = this.shadowRoot.querySelector(`#${id}`);
        const clone = template.content.cloneNode(true);
        clone.querySelector("p").innerText = message;

        const container = this.shadowRoot.querySelector(".toast-container");
        const element = clone.firstElementChild;
        container.appendChild(element);

        setTimeout(() => {
            element.remove();
        }, this.duration);
    }

    /**
     * Display an informational toast.
     * @param {string} message - The message to display.
     */
    info(message) {
        this.#showTemplate("info-toast", message);
    }

    /**
     * Display a success toast.
     * @param {string} message - The message to display.
     */
    success(message) {
        this.#showTemplate("success-toast", message);
    }

    /**
     * Display a warning toast.
     * @param {string} message - The message to display.
     */
    warning(message) {
        this.#showTemplate("warning-toast", message);
    }

    /**
     * Display an error toast.
     * @param {string} message - The message to display.
     */
    error(message) {
        this.#showTemplate("error-toast", message);
    }
}

// Register custom element and attach a global helper for direct usage.
customElements.define(ToastNotification.name, ToastNotification);

globalThis.toastNotification = class {
    static info(message) {
        const toast = document.querySelector("toast-notification");
        toast.info(message);
    }

    static success(message) {
        const toast = document.querySelector("toast-notification");
        toast.success(message);
    }

    static warning(message) {
        const toast = document.querySelector("toast-notification");
        toast.warning(message);
    }

    static error(message) {
        const toast = document.querySelector("toast-notification");
        toast.error(message);
    }
}

document.body.appendChild(document.createElement("toast-notification"));