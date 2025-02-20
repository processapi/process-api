class DomModule {
    static name = Object.freeze("dom");

    static async measure_template(template) {
        const div = document.createElement("div");
        div.style.display = "none";
        div.appendChild(template.cloneNode(true));
    
        document.body.appendChild(div);
        const height = div.clientHeight;
        document.body.removeChild(div);
        return height;
    }
}

export { DomModule };