import {validateArgs} from "../validate/validate-args.js";
import init, {markdown_to_html} from "./markdown/markdown.js";

await init();

export class MarkdownModule {
    static name = Object.freeze("messaging");

    static async to_html(args) {
        validateArgs(args, {
            markdown: {type: "string", required: true},
        }, "MarkdownModule.to_html: ");

        return markdown_to_html(args.markdown);
    }
}