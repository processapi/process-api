class CanvasWorker {
    #width;
    #height;
    #dpr;
    #ctx;

    initialize(canvas, width, height, dpr) {
        this.#width = width;
        this.#height = height;
        this.#dpr = dpr;
        this.#ctx = canvas.getContext("2d");
        this.#ctx.scale(dpr, dpr);
    }
}

const instance = new CanvasWorker();


self.onmessage = function(event) {
    instance[event.data.method](...event.data.args);
}