import {ComponentModule} from "../../src/modules/component.js";

export class ToastNotification extends HTMLElement {
    static name = Object.freeze("toast-notification");

    get duration() {
        return parseInt(this.getAttribute("duration")) || 3000;
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    async connectedCallback() {
        this.shadowRoot.innerHTML = await ComponentModule.load_html({
            url: import.meta.url,
        });
    }

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

    info(message) {
        this.#showTemplate("info-toast", message);
    }

    success(message) {
        this.#showTemplate("success-toast", message);
    }

    warning(message) {
        this.#showTemplate("warning-toast", message);
    }

    error(message) {
        this.#showTemplate("error-toast", message);
    }
}

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