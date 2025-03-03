
class CanvasWorker {
    #width;
    #height;
    #dpr;
    #ctx;
    #quadTreeWorker;
    #quadTreeMessageHandler = this.#quadTreeMessage.bind(this);
    #mouseRect = { x: 0, y: 0, width: 100, height: 100 };

    #colors = {
        "background": "#f0f0f0",
        "quadTree": "silver"
    }

    #quadTreeMessage(event) {
        if (event.data.method === "getBoundaries") {
            this.clear();

            this.#ctx.fillStyle = "transparent";
            this.#ctx.strokeStyle = this.#colors.quadTree;

            for (const boundary of event.data.args[0]) {
                this.#ctx.strokeRect(boundary.x, boundary.y, boundary.width, boundary.height);
            }

            this.#ctx.fillStyle = "cornflowerblue";
            for (const point of event.data.args[1]) {
                this.#ctx.fillRect(point.x, point.y, point.width, point.height);
            }

            this.#ctx.strokeStyle = "red";
            this.#ctx.strokeRect(this.#mouseRect.x, this.#mouseRect.y, this.#mouseRect.width, this.#mouseRect.height);

            this.#ctx.font = '24px Arial';
            this.#ctx.fillText(`Detected Count: ${event.data.args[1].length}`, 10, 50);
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

        //this.#animationHandler();
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

    resize(width, height) {
        this.#width = width;
        this.#height = height;

        this.#ctx.canvas.width = this.#width * this.#dpr;
        this.#ctx.canvas.height = this.#height * this.#dpr;
        this.#ctx.scale(this.#dpr, this.#dpr);

        this.#quadTreeWorker.postMessage({ method: "resize", args: [width, height] });
        this.#quadTreeWorker.postMessage({ method: "getBoundaries", args: [this.#mouseRect.x, this.#mouseRect.y, this.#mouseRect.width, this.#mouseRect.height] });
    }

    mouseMove(x, y) {
        this.#mouseRect.x = x - this.#mouseRect.width / 2;
        this.#mouseRect.y = y - this.#mouseRect.height / 2;
        this.#quadTreeWorker.postMessage({ method: "getBoundaries", args: [this.#mouseRect.x, this.#mouseRect.y, this.#mouseRect.width, this.#mouseRect.height] });
    }

    mouseClick(x, y) {
        const rect = {
            x: x - this.#mouseRect.width / 2,
            y: y - this.#mouseRect.height / 2,
            width: this.#mouseRect.width,
            height: this.#mouseRect.height
        }

        this.#quadTreeWorker.postMessage({ method: "removePoints", args: [rect.x, rect.y, rect.width, rect.height] });
    }

    mouseScroll(deltaY) {
        this.#mouseRect.width += Math.round(deltaY / 2);
        this.#mouseRect.height += Math.round(deltaY / 2);
        this.#mouseRect.x -= Math.round(deltaY / 4);
        this.#mouseRect.y -= Math.round(deltaY / 4);
        this.#quadTreeWorker.postMessage({ method: "getBoundaries", args: [this.#mouseRect.x, this.#mouseRect.y, this.#mouseRect.width, this.#mouseRect.height] });
    }
}

const instance = new CanvasWorker();

self.onmessage = function(event) {
    if (instance[event.data.method] == null) {
        console.error(`Method ${event.data.method} does not exist`);
    }
    instance[event.data.method](...event.data.args);
}