import { validateArgs } from "../validate/validate-args.js";

/**
 * @class ComponentModule
 * @description Helper class for working with web components.
 */
class ComponentModule {
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
            hasCss: { type: "boolean", required: false }
        }, "ComponentModule.load_html: ");

        const { url, hasCss } = args;
        const htmlPath = url.replace(".js", ".html");

        let html = await fetch(htmlPath).then(result => result.text());

        // we assume that component has a css file.
        // set hasCss to false if component does not have a css file.
        if (hasCss !== false) {
            const cssPath = url.replace(".js", ".css");
            html = `<link rel="stylesheet" href="${cssPath}">${html}`;
        }

        return html;
    }
}

export { ComponentModule };