import init, {markdown_to_html} from "./markdown/markdown.js";

await init();

export class MarkdownModule {
    static name = Object.freeze("messaging");

    static async to_html(args) {
        return markdown_to_html(args.markdown);
    }
}