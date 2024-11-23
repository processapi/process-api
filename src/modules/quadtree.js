import { validateArgs } from "../validate/validate-args.js";
import { QuadTree }  from "./quadtree/quadtree.js";

export class QuadTreeModule {
    static name = Object.freeze("canvas");

    static async initialize(args) {
        validateArgs(args, {
            width   : {type: "Number", required: true},
            height  : {type: "Number", required: true},
        }, "QuadTreeModule.initialize: ");

        const { width, height } = args;

        return new QuadTree({ x: 0, y: 0, width, height }, 4);
    }
}