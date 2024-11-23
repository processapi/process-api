import { validateArgs } from "../validate/validate-args.js";
import { QuadTree }  from "./quadtree/quadtree.js";

export class QuadTreeModule {
    static name = Object.freeze("canvas");

    static async initialize(args) {
        validateArgs(args, {
            canvasElement: {type: "OffscreenCanvas", required: true},
        }, "QuadTreeModule.initialize: ");

        const {width, height} = args.canvasElement;
        return new QuadTree({ x: 0, y: 0, width, height }, 4);
    }
}