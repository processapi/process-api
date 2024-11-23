import { validateArgs } from "../validate/validate-args.js";

export class CanvasModule {
    static name = Object.freeze("canvas");

    static async initialize(args) {
        validateArgs(args, {
            canvasElement: { type: "HTMLCanvasElement", required: true },
            workerSource: { type: "string", required: true }
        }, "CanvasModule.initialize: ");

        const { canvasElement, workerSource } = args;
        const rect = canvasElement.getBoundingClientRect();
        const width = Math.round(rect.width);
        const height = Math.round(rect.height);

        return initialize(canvasElement, width, height, workerSource);
    }
}

export function initialize(canvasElement, width, height, workerSource) {
    canvasElement.style.setProperty("--width", `${width}px`);
    canvasElement.style.setProperty("--height", `${height}px`);
    return createCanvas(canvasElement, width, height, workerSource);
}

function createCanvas(canvasElement, width, height, workerSource) {
    const dpr = globalThis.devicePixelRatio;
    const offscreen = canvasElement.transferControlToOffscreen();
    offscreen.width = width * dpr;
    offscreen.height = height * dpr;

    return new CanvasWorker(workerSource, offscreen, width, height, dpr);
}

class CanvasWorker {
    #worker;

    constructor(workerSource, offscreen, width, height, dpr) {
        this.#worker = new Worker(workerSource, { type: "module" });

        this.#worker.postMessage(
            {
                method: "initialize",
                args: [offscreen, width, height, dpr]
            },
            [offscreen]
        );
    }

    call(action, ...args) {
        this.#worker.postMessage({ method: action, args });
    }
}