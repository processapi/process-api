class DomModule {
    static name = Object.freeze("dom");

    static measure_template(template, parentElement) {
        return new Promise(resolve => {
            const div = document.createElement("div");
            div.id = "measure";
            div.style.position = "fixed";
            div.style.top = 0;
            div.style.left = 0;
            div.style.height = "auto";
            div.style.width = "auto";
            div.appendChild(template.content.cloneNode(true));
        
            parentElement.appendChild(div);

            requestAnimationFrame(() => {
                const width = div.clientWidth;
                const height = div.clientHeight;
                parentElement.removeChild(div);    
                resolve({width, height});
            });
        })
    }
}

export { DomModule };