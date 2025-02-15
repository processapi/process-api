import { QuadTree }  from "./quadtree/quadtree.js";

export class QuadTreeModule {
    static name = Object.freeze("canvas");

    static async initialize(args) {
        const { width, height, capacity } = args;

        return new QuadTree({ x: 0, y: 0, width, height }, capacity ?? 8);
    }
}