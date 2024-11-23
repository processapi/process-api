import { QuadTreeModule } from "../../src/modules/quadtree.js";

class QuadtreeWorker {
    #quadTree;

    constructor() {
        this.#quadTree = null;
    }

    async initialize(width, height) {
        this.#quadTree = await QuadTreeModule.initialize({ width, height });
        await addRandomItems(this.#quadTree, 10000);

        const allPoints = this.#quadTree.getAllPoints();
        console.log(allPoints.length);

        await this.getBoundaries();
    }

    async getBoundaries(x, y, width, height) {
        const result = [];
        getBoundaries(this.#quadTree, result);
        const collided = this.#quadTree.query({x, y, width, height});

        postMessage({ method: "getBoundaries", args: [result, collided] });
    }

    async removePoints(x, y, width, height) {
        const points = this.#quadTree.query({ x, y, width, height });

        for (const point of points) {
            this.#quadTree.remove(point);
        }

        await this.getBoundaries();
    }

    async resize(width, height) {
        await this.#quadTree.resize(width, height);
        await this.getBoundaries();
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
    const topLeft = { x: 0, y: 0 };
    const bottomRight = { x: quadTree.width, y: quadTree.height };

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
    if (instance[event.data.method] == null) {
        console.error(`Method ${event.data.method} does not exist`);
    }
    instance[event.data.method](...(event.data.args ?? []));
}