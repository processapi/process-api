class CanvasWorker {
    #width;
    #height;
    #dpr;
    #ctx;
    async intialize(canvas, width, height, dpr) {
        this.#width = width;
        this.#height = height;
        this.#dpr = dpr;
        this.#ctx = canvas.getContext("2d");
    }
}

const instance = new CanvasWorker();

self.onmessage = function(event) {
    if (instance[event.data.method] == null) {
        console.error(`Method ${event.data.method} does not exist`);
    }

    instance[event.data.method](...event.data.args);
}