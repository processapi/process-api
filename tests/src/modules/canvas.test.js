import { assertEquals } from "https://deno.land/std@0.55.0/testing/asserts.ts";
import { CanvasModule, CanvasWorker } from "./../../../src/modules/canvas.js";
import { stub } from "https://deno.land/std@0.224.0/testing/mock.ts";

globalThis.HTMLCanvasElement = class {
    get style() {
        return {
            setProperty: stub(() => {}),
        };
    }

    getBoundingClientRect() {
        return stub(() => ({ width: 800, height: 600 }))
    };

    transferControlToOffscreen() {
        return stub(() => ({ width: 0, height: 0 }));
    }
}

globalThis.Worker = class {
    constructor() {
        this.postMessage = stub(() => {});
        this.addEventListener = stub(() => {});
    }
};

Deno.test("CanvasModule.initialize should validate arguments and call initialize", async () => {
    const canvasElement = new HTMLCanvasElement();

    const workerSource = (new URL("./worker.js", import.meta.url)).href;
    const result = await CanvasModule.initialize({ canvasElement, workerSource });

    assertEquals(result instanceof CanvasWorker, true);
});