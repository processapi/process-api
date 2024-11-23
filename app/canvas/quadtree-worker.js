import { QuadTreeModule } from "../../src/modules/quadtree.js";

class QuadtreeWorker {
    #quadTree;

    constructor() {
        this.#quadTree = null;
    }

    async initialize(width, height) {
        this.#quadTree = await QuadTreeModule.initialize({ width, height });
        await addRandomItems(this.#quadTree, 10000);
        await this.getBoundaries();
    }

    async getBoundaries() {
        const result = [];
        getBoundaries(this.#quadTree, result);

        const points = this.#quadTree.query(
            {
                x: 0,
                y: 0,
                width: this.#quadTree.width,
                height: this.#quadTree.height
            });

        postMessage({ method: "getBoundaries", args: [result, points] });
    }
}

function getBoundaries(quadTree, found = []) {
    if (!quadTree.divided) {
        found.push(quadTree.boundary);
    }
    else {
        getBoundaries(quadTree.northwest, found);
        getBoundaries(quadTree.northeast, found);
        getBoundaries(quadTree.southwest, found);
        getBoundaries(quadTree.southeast, found);
    }

    return found;
}

function addRandomItems(quadTree, count) {
    const topLeft = { x: -quadTree.width, y: -quadTree.height };
    const bottomRight = { x: quadTree.width * 2, y: quadTree.height * 2 };

    for (let i = 0; i < count; i++) {
        const x = Math.random() * (bottomRight.x - topLeft.x) + topLeft.x;
        const y = Math.random() * (bottomRight.y - topLeft.y) + topLeft.y;
        const width = 10 + Math.random() * 3;
        const height = 10 + Math.random() * 3;
        quadTree.insert({ x, y, width, height });
    }
}

const instance = new QuadtreeWorker();

self.onmessage = function(event) {
    instance[event.data.method](...(event.data.args ?? []));
}