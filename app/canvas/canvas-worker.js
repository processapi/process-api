import { QuadTreeModule } from "../../src/modules/quadtree.js";

class CanvasWorker {
    #width;
    #height;
    #dpr;
    #ctx;
    #quadTree;

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
        this.#quadTree = await QuadTreeModule.initialize({ canvasElement: canvas });

        addRandomItems(this.#quadTree, 10000);
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

function addRandomItems(quadTree, count) {
    for (let i = 0; i < count; i++) {
        const x = Math.random() * quadTree.width;
        const y = Math.random() * quadTree.height;
        const width = 10 + Math.random() * 3;
        const height = 10 + Math.random() * 3;
        quadTree.insert({ x, y });
    }
}

const instance = new CanvasWorker();

self.onmessage = function(event) {
    instance[event.data.method](...event.data.args);
}