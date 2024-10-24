// deno-lint-ignore-file require-await
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

    /**
     * @method create
     * @description - Create a Object for columns and rows based on the columnCount and rowCount
     * All columns and rows are set to 1fr by default
     * @param args
     * @param {number} args.columnCount - The number of columns to create
     * @param {number} args.rowCount - The number of rows to create
     * @returns {Promise<{columns: any[], rows: any[]}>}
     */
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

    /**
     * @method push
     * @description - Add a column or row to the grid data
     * @param args
     * @param {object} args.data - The grid data to update
     * @param {string} args.column - The column to add
     * @param {string} args.row - The row to add
     * @returns {Promise<*>}
     */
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

    /**
     * @method optimize
     * @description - Optimize the grid data by removing any duplicate columns or rows
     * For example "1fr 1fr 1fr" becomes "repeat(3, 1fr)"
     * and "1fr 1fr 2fr 3fr" becomes "repeat(2, 1fr) 2fr 3fr"
     * @param args
     * @param {string} args.values - The grid values to optimize
     * @returns {Promise<string>}
     */
    static async optimize(args) {
        validateArgs(args, {
            values: { type: "string", required: true }
        }, "CssGridModule.optimize: ");

        const parts = args.values.split(" ");
        const optimized = [];
        let count = 1;
        let current = parts[0];

        for (let i = 1; i < parts.length; i++) {
            if (parts[i] === current) {
                count++;
            } else {
                if (count > 1) {
                    optimized.push(`repeat(${count}, ${current})`);
                } else {
                    optimized.push(current);
                }
                current = parts[i];
                count = 1;
            }
        }

        if (count > 1) {
            optimized.push(`repeat(${count}, ${current})`);
        } else {
            optimized.push(current);
        }

        return optimized.join(" ");
    }
}