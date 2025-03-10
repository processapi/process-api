export class CanvasModule {
    static name = Object.freeze("canvas");

    static async initialize(args) {
        const { canvasElement, workerSource } = args;
        const rect = canvasElement.getBoundingClientRect();
        const width = Math.round(rect.width);
        const height = Math.round(rect.height);

        return initialize(canvasElement, width, height, workerSource);
    }
}

function initialize(canvasElement, width, height, workerSource) {
    canvasElement.style.setProperty("--width", `${width}px`);
    canvasElement.style.setProperty("--height", `${height}px`);
    return createCanvas(canvasElement, width, height, workerSource);
}

function createCanvas(canvasElement, width, height, workerSource) {
    const dpr = globalThis.devicePixelRatio;
    const offscreen = canvasElement.transferControlToOffscreen();
    offscreen.width = width * dpr;
    offscreen.height = height * dpr;

    return new CanvasWorker(canvasElement, workerSource, offscreen, width, height, dpr);
}

export class CanvasWorker {
    #worker;
    #onResizeHandler = this.#onResize.bind(this);
    #canvasElement;

    constructor(canvasElement, workerSource, offscreen, width, height, dpr) {
        this.#canvasElement = canvasElement;
        this.#worker = new Worker(workerSource, { type: "module" });

        this.#worker.postMessage(
            {
                method: "initialize",
                args: [offscreen, width, height, dpr]
            },
            [offscreen]
        );

        globalThis.addEventListener("resize", this.#onResizeHandler);
    }

    dispose() {
        globalThis.removeEventListener("resize", this.#onResizeHandler);
        this.#worker.terminate();
        this.#canvasElement = null;
    }

    #onResize() {
        const rect = this.#canvasElement.getBoundingClientRect();
        this.call("resize", Math.round(rect.width), Math.round(rect.height));
    }

    call(action, ...args) {
        this.#worker.postMessage({ method: action, args });
    }
}