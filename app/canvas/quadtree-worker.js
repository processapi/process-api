import { QuadTreeModule } from "../../src/modules/quadtree.js";

class QuadtreeWorker {
    #quadTree;

    constructor() {
        this.#quadTree = null;
    }

    async initialize(width, height) {
        this.#quadTree = await QuadTreeModule.initialize({ width, height });
        await this.addRandomItems(10000);

        console.log(this.#quadTree);
    }

    async addRandomItems(count) {
        addRandomItems(this.#quadTree, count);
    }
}

function addRandomItems(quadTree, count) {
    for (let i = 0; i < count; i++) {
        const x = Math.random() * quadTree.width;
        const y = Math.random() * quadTree.height;
        const width = 10 + Math.random() * 3;
        const height = 10 + Math.random() * 3;
        quadTree.insert({ x, y, width, height });
    }
}

const instance = new QuadtreeWorker();

self.onmessage = function(event) {
    instance[event.data.method](...event.data.args);
}