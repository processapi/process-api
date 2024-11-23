
class CanvasWorker {
    #width;
    #height;
    #dpr;
    #ctx;
    #quadTreeWorker;
    #quadTreeMessageHandler = this.#quadTreeMessage.bind(this);

    #colors = {
        "background": "#f0f0f0",
        "quadTree": "gray"
    }

    #quadTreeMessage(event) {
        if (event.data.method === "getBoundaries") {
            this.#ctx.fillStyle = "transparent";
            this.#ctx.strokeStyle = this.#colors.quadTree;

            for (const boundary of event.data.args[0]) {
                this.#ctx.strokeRect(boundary.x, boundary.y, boundary.width, boundary.height);
            }
        }
    }

    async initialize(canvas, width, height, dpr, colors) {
        this.#width = width;
        this.#height = height;
        this.#dpr = dpr;
        this.#ctx = canvas.getContext("2d");
        this.#ctx.scale(dpr, dpr);

        this.setColors(colors);
        this.#quadTreeWorker = new Worker(new URL("./quadtree-worker.js", import.meta.url).href, { type: "module" });
        this.#quadTreeWorker.addEventListener("message", this.#quadTreeMessageHandler);
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