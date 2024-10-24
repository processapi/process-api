import {
    assertEquals,
    assertThrowsAsync,
} from "https://deno.land/std@0.55.0/testing/asserts.ts";

import {CssGridModule} from "./../../../src/modules/css-grid.js"

Deno.test("CssGridModule.create - should return default grid when no arguments are provided", async () => {
    const grid = await CssGridModule.create();
    assertEquals(grid, { columns: ["1fr"], rows: ["1fr"] });
});

Deno.test("CssGridModule.create - should return grid with specified column count", async () => {
    const grid = await CssGridModule.create({ columnCount: 3 });
    assertEquals(grid, { columns: ["1fr", "1fr", "1fr"], rows: ["1fr"] });
});

Deno.test("CssGridModule.create - should return grid with specified row count", async () => {
    const grid = await CssGridModule.create({ rowCount: 2 });
    assertEquals(grid, { columns: ["1fr"], rows: ["1fr", "1fr"] });
});

Deno.test("CssGridModule.create - should return grid with specified column and row count", async () => {
    const grid = await CssGridModule.create({ columnCount: 2, rowCount: 3 });
    assertEquals(grid, { columns: ["1fr", "1fr"], rows: ["1fr", "1fr", "1fr"] });
});

Deno.test("CssGridModule.create - should throw an error if columnCount is not a number", async () => {
    await assertThrowsAsync(
        () => CssGridModule.create({ columnCount: "invalid" }),
        Error,
        'CssGridModule.create: Argument "columnCount" should be of type "number"'
    );
});

Deno.test("CssGridModule.create - should throw an error if rowCount is not a number", async () => {
    await assertThrowsAsync(
        () => CssGridModule.create({ rowCount: "invalid" }),
        Error,
        'CssGridModule.create: Argument "rowCount" should be of type "number"'
    );
});

Deno.test("CssGridModule.push - should add a column to the grid", async () => {
    const data = { columns: ["1fr"], rows: ["1fr"] };
    const result = await CssGridModule.push({ data, column: "2fr" });
    assertEquals(result.columns, ["1fr", "2fr"]);
});

Deno.test("CssGridModule.push - should add a row to the grid", async () => {
    const data = { columns: ["1fr"], rows: ["1fr"] };
    const result = await CssGridModule.push({ data, row: "2fr" });
    assertEquals(result.rows, ["1fr", "2fr"]);
});

Deno.test("CssGridModule.push - should add both a column and a row to the grid", async () => {
    const data = { columns: ["1fr"], rows: ["1fr"] };
    const result = await CssGridModule.push({ data, column: "2fr", row: "2fr" });
    assertEquals(result.columns, ["1fr", "2fr"]);
    assertEquals(result.rows, ["1fr", "2fr"]);
});

Deno.test("CssGridModule.push - should throw an error if data is not provided", async () => {
    await assertThrowsAsync(
        () => CssGridModule.push({ column: "2fr" }),
        Error,
        'CssGridModule.push: Argument "data" is required'
    );
});

Deno.test("CssGridModule.from - should convert CSS grid-template values to an object", async () => {
    const result = await CssGridModule.from({ columns: "1fr 2fr", rows: "3fr 4fr" });
    assertEquals(result, { columns: ["1fr", "2fr"], rows: ["3fr", "4fr"] });
});

Deno.test("CssGridModule.from - should use default values if arguments are not provided", async () => {
    const result = await CssGridModule.from({});
    assertEquals(result, { columns: ["1fr"], rows: ["1fr"] });
});

Deno.test("CssGridModule.to - should convert an object to CSS grid-template values", async () => {
    const result = await CssGridModule.to({ data: { columns: ["1fr", "2fr"], rows: ["3fr", "4fr"] } });
    assertEquals(result, { columns: "1fr 2fr", rows: "3fr 4fr" });
});

Deno.test("CssGridModule.to - should throw an error if data is not provided", async () => {
    await assertThrowsAsync(
        () => CssGridModule.to({}),
        Error,
        'CssGridModule.to: Argument "data" is required'
    );
});

Deno.test("CssGridModule.optimize - should optimize grid values by removing duplicates", async () => {
    const result = await CssGridModule.optimize({ values: "1fr 1fr 1fr" });
    assertEquals(result, "repeat(3, 1fr)");
});

Deno.test("CssGridModule.optimize - should handle mixed values correctly", async () => {
    const result = await CssGridModule.optimize({ values: "1fr 1fr 2fr 3fr" });
    assertEquals(result, "repeat(2, 1fr) 2fr 3fr");
});

Deno.test("CssGridModule.optimize - should return single value without repeat", async () => {
    const result = await CssGridModule.optimize({ values: "1fr" });
    assertEquals(result, "1fr");
});

Deno.test("CssGridModule.optimize - should handle no duplicates correctly", async () => {
    const result = await CssGridModule.optimize({ values: "1fr 2fr 3fr" });
    assertEquals(result, "1fr 2fr 3fr");
});

Deno.test("CssGridModule.optimize - should throw an error if values are not provided", async () => {
    await assertThrowsAsync(
        () => CssGridModule.optimize({}),
        Error,
        'CssGridModule.optimize: Argument "values" is required'
    );
});