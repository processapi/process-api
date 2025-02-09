import { validateArgs } from "../validate/validate-args.js";

/**
 * @class ComponentModule
 * @description Helper class for working with web components.
 */
class ComponentModule {
	/**
	 * @property name
	 * @type {string}
	 * @static
	 * @description Name of the module
	 */
	static name = Object.freeze("component");

	/**
	 * @method load_html
	 * @param args {Object} - Arguments object
	 * @param args.url {string} - URL of the component js file
	 * @returns
	 *
	 * @example
	 * await ComponentModule.load_html({ url: import.meta.url });
	 *
	 * @example
	 * await api.call("component", "load_html", { url: import.meta.url });
	 */
	static async load_html(args) {
		validateArgs(args, {
			url: { type: "string", required: true },
			hasCss: { type: "boolean", required: false },
		}, "ComponentModule.load_html: ");

		const { url, hasCss } = args;
		const htmlPath = url.replace(".js", ".html");

		let html = await fetch(htmlPath).then((result) => result.text());

		// we assume that component has a css file.
		// set hasCss to false if component does not have a css file.
		if (hasCss !== false) {
			const cssPath = url.replace(".js", ".css");
			html = `<link rel="stylesheet" href="${cssPath}">${html}`;
		}

		return html;
	}

	static async load_component(args) {
		validateArgs(args, {
			element: { type: "HTMLElement", required: true },
			url: { type: "string", required: true },
		}, "ComponentModule.load_component: ");

		const promise = new Promise((resolve) => {
			const { element, url } = args;

			ComponentModule.load_html({ url }).then((html) => {
				element.shadowRoot.innerHTML = html;

				requestAnimationFrame(() => {
					ComponentModule.ready({ element });
					resolve();
				});
			});
		});

		await promise;
	}

	/**
	 * @method ready
	 * @description Set the ready attribute to true on an element.
	 * @param args {Object} - Arguments object
	 * @param args.element {HTMLElement} - Element to set the ready attribute on
	 *
	 * @example
	 * await ComponentModule.ready({ element: document.querySelector("my-component") });
	 * @returns {Promise<void>}
	 */
	static async ready(args){
		validateArgs(args, {
			element: { type: "HTMLElement", required: true },
		}, "ComponentModule.ready: ");

		const { element } = args;

		element.dataset.ready = "true";
		element.dispatchEvent(new CustomEvent("ready"));
	}

	/**
	 * @method on_ready
	 * @description Wait for an element to be ready.
	 * @param args {{callback: *, element: Element}} - Arguments object
	 * @param args.element {HTMLElement} - Element to wait for
	 * @param args.callback {function} - Callback to call when element is ready
	 * @returns {Promise<void>}
	 *
	 * @example
	 * await ComponentModule.on_ready({
	 *    element: document.querySelector("my-component"),
	 *    callback: () => {
	 *    	console.log("Component is ready");
	 *    }
	 * });
	 */
	static async on_ready(args) {
		validateArgs(args, {
			element: { type: "HTMLElement", required: true },
			callback: { type: "function", required: true },
		}, "ComponentModule.on_ready: ");

		const { element, callback } = args;

		if (element.dataset.ready === "true") {
			callback();
		}
		else {
			element.addEventListener("ready", callback);
		}
	}

	/**
	 * @method filter_ul
	 * @description Filter a list of items in an unordered list.
	 * Given a text, look at the text content or given attribute to check if a list item should be visible.
	 * The list items that should be visible, the hidden attribute is absent.
	 * When the list item should NOT be visible, the hidden attribute is present.
	 * Set the hidden attribute on the stylesheet to be display: none.
	 * @param args {Object} - Arguments object
	 * @param args.text {string} - Text to filter by
	 * @param args.attribute {string | null} - Attribute to filter - if attribute should be checked with the text to filter by.
	 * @returns {Promise<void>}
	 */
	static async filter_ul(args) {
		const { text, attribute, listElement } = args;
		const items = listElement.querySelectorAll("li");

		items.forEach((item) => {
			const content = item.textContent;
			const attr = item.getAttribute(attribute);

			if (content.includes(text) || (attr?.includes(text))) {
				item.removeAttribute("hidden");
			} else {
				item.setAttribute("hidden", "hidden");
			}
		});
	}
}

export { ComponentModule };
