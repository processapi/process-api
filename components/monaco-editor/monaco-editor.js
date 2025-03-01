import { HTML } from "./monaco-editor.html.js";
import "./require.js";

export default class MonacoEditor extends HTMLElement {
    static tag = "monaco-editor";

    #editor;

    get language() {
        return this.dataset.language ?? "json";
    }

    get theme() {
        return this.dataset.theme ?? "vs-dark";
    }
    
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = HTML;
    }

    async connectedCallback() {
        await import("./node_modules/monaco-editor/min/vs/loader.js");
        await import("./node_modules/monaco-editor/min/vs/editor/editor.main.js");
        

        this.#editor = monaco.editor.create(this.shadowRoot.querySelector("#editor"), {
            value: this.textContent,
            language: this.language,
            theme: this.theme,
            automaticLayout: true,
        });
    }
};

customElements.define(MonacoEditor.tag, MonacoEditor);