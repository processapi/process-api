import { HTML } from "./monaco-editor.html.js";
import "./require.js";

export default class MonacoEditor extends HTMLElement {
    static tag = "monaco-editor";

    #editor;

    get editor() {
        return this.#editor;
    }

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
        const url = new URL('./node_modules/monaco-editor/min/vs', import.meta.url);
        requirejs.config({ paths: { 'vs': url.href } });

        require(['vs/editor/editor.main'], () => {
            this.#editor = monaco.editor.create(this.shadowRoot.querySelector("#editor"), {
                value: this.textContent.trim(),
                language: this.language,
                theme: this.theme,
                automaticLayout: true,
            });
        });                       
    }
};

customElements.define(MonacoEditor.tag, MonacoEditor);