import { validateArgs } from "../validate/validate-args.js";

export class CssGridModule {
    static name = Object.freeze("css_grid");

    /**
     * @method from
     * @description - Convert CSS grid-template-columns and grid-template-rows to an object
     * @param args
     * @param {string} args.columns - The grid-template-columns value
     * @param {string} args.rows - The grid-template-rows value
     * @returns {Promise<void>}
     */
    static async from(args) {
        validateArgs(args, {
            "columns": { type: "string", default: "1fr" },
            "rows": { type: "string", default: "1fr" }
        }, "CssGridModule.from: ");

        return {
            columns: args.columns.split(" "),
            rows: args.rows.split(" ")
        }
    }

    /**
     * @method to
     * @description - Convert an object to CSS grid-template-columns and grid-template-rows
     * @param args
     * @param {object} args.data - The object to convert
     * @param {string[]} args.data.columns - The columns of the grid
     * @param {string[]} args.data.rows - The rows of the grid
     * @returns {Promise<{columns: string, rows: string}>}
     */
    static async to(args) {
        validateArgs(args, {
            "data": { type: "object", required: true }
        }, "CssGridModule.to: ");

        return {
            columns: args.data.columns.join(" "),
            rows: args.data.rows.join(" ")
        }
    }

    static async create(args) {
        args = args ?? {};

        validateArgs(args, {
            columnCount: { type: "number", default: 1 },
            rowCount: { type: "number", default: 1 }
        }, "CssGridModule.create: ");

        const columns = new Array(args.columnCount).fill("1fr");
        const rows = new Array(args.rowCount).fill("1fr");

        return {
            columns, rows
        }
    }

    static async push(args) {
        validateArgs(args, {
            data: { type: "object", required: true },
            column: { type: "string" },
            row: { type: "string" }
        }, "CssGridModule.push: ");

        if (args.column) {
            args.data.columns.push(args.column);
        }

        if (args.row) {
            args.data.rows.push(args.row);
        }

        return args.data;
    }
}