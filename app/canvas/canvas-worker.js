
class CanvasWorker {
    #width;
    #height;
    #dpr;
    #ctx;
    #quadTreeWorker;

    #colors = {
        "background": "#f0f0f0",
    }

    async initialize(canvas, width, height, dpr, colors) {
        this.#width = width;
        this.#height = height;
        this.#dpr = dpr;
        this.#ctx = canvas.getContext("2d");
        this.#ctx.scale(dpr, dpr);

        this.setColors(colors);
        this.#quadTreeWorker = new Worker(new URL("./quadtree-worker.js", import.meta.url).href, { type: "module" });
        this.#quadTreeWorker.postMessage({ method: "initialize", args: [width, height] });
    }

    setColors(colors) {
        if (colors == null) return;

        for (const key of Object.keys(colors)) {
            this.#colors[key] = colors[key];
        }
    }

    clear() {
        this.#ctx.fillStyle = this.#colors.background;
        this.#ctx.fillRect(0, 0, this.#width, this.#height);
    }

    resize() {
        this.#ctx.canvas.width = this.#width * this.#dpr;
        this.#ctx.canvas.height = this.#height * this.#dpr;
        this.#ctx.scale(this.#dpr, this.#dpr);
    }
}

const instance = new CanvasWorker();

self.onmessage = function(event) {
    instance[event.data.method](...event.data.args);
}