import {
	assertEquals,
	assertThrowsAsync,
} from "https://deno.land/std@0.55.0/testing/asserts.ts";

import { CssGridModule } from "./../../../src/modules/css-grid.js";

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
		'CssGridModule.create: Argument "columnCount" should be of type "number"',
	);
});

Deno.test("CssGridModule.create - should throw an error if rowCount is not a number", async () => {
	await assertThrowsAsync(
		() => CssGridModule.create({ rowCount: "invalid" }),
		Error,
		'CssGridModule.create: Argument "rowCount" should be of type "number"',
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
		'CssGridModule.push: Argument "data" is required',
	);
});

Deno.test("CssGridModule.from - should convert CSS grid-template values to an object", async () => {
	const result = await CssGridModule.from({
		columns: "1fr 2fr",
		rows: "3fr 4fr",
	});
	assertEquals(result, { columns: ["1fr", "2fr"], rows: ["3fr", "4fr"] });
});

Deno.test("CssGridModule.from - should use default values if arguments are not provided", async () => {
	const result = await CssGridModule.from({});
	assertEquals(result, { columns: ["1fr"], rows: ["1fr"] });
});

Deno.test("CssGridModule.to - should convert an object to CSS grid-template values", async () => {
	const result = await CssGridModule.to({
		data: { columns: ["1fr", "2fr"], rows: ["3fr", "4fr"] },
	});
	assertEquals(result, { columns: "1fr 2fr", rows: "3fr 4fr" });
});

Deno.test("CssGridModule.to - should throw an error if data is not provided", async () => {
	await assertThrowsAsync(
		() => CssGridModule.to({}),
		Error,
		'CssGridModule.to: Argument "data" is required',
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
		'CssGridModule.optimize: Argument "values" is required',
	);
});

Deno.test("CssGridModule.to_regions - should convert grid data to regions", async () => {
	const data = { columns: ["1fr", "1fr", "1fr"], rows: ["1fr", "1fr", "1fr"] };
	const result = await CssGridModule.to_regions({ data });
	assertEquals(result, [
		["A0", "B0", "C0"],
		["A1", "B1", "C1"],
		["A2", "B2", "C2"],
	]);
});

Deno.test("CssGridModule.to_regions - should handle single row and column", async () => {
	const data = { columns: ["1fr"], rows: ["1fr"] };
	const result = await CssGridModule.to_regions({ data });
	assertEquals(result, [["A0"]]);
});

Deno.test("CssGridModule.to_regions - should handle multiple rows and single column", async () => {
	const data = { columns: ["1fr"], rows: ["1fr", "1fr"] };
	const result = await CssGridModule.to_regions({ data });
	assertEquals(result, [["A0"], ["A1"]]);
});

Deno.test("CssGridModule.to_regions - should handle single row and multiple columns", async () => {
	const data = { columns: ["1fr", "1fr"], rows: ["1fr"] };
	const result = await CssGridModule.to_regions({ data });
	assertEquals(result, [["A0", "B0"]]);
});

Deno.test("CssGridModule.to_regions - should throw an error if data is not provided", async () => {
	await assertThrowsAsync(
		() => CssGridModule.to_regions({}),
		Error,
		'CssGridModule.to_regions: Argument "data" is required',
	);
});

Deno.test("CssGridModule.copyRegion - should copy a single cell region", async () => {
	const regions = [
		["A0", "B0", "C0"],
		["A1", "B1", "C1"],
		["A2", "B2", "C2"],
	];
	const result = await CssGridModule.copy_region({
		regions,
		start: { row: 0, column: 0 },
		end: { row: 0, column: 0 },
	});
	assertEquals(result, [
		["A0", "B0", "C0"],
		["A1", "B1", "C1"],
		["A2", "B2", "C2"],
	]);
});

Deno.test("CssGridModule.copyRegion - should copy a region to a larger area", async () => {
	const regions = [
		["A0", "B0", "C0"],
		["A1", "B1", "C1"],
		["A2", "B2", "C2"],
	];
	const result = await CssGridModule.copy_region({
		regions,
		start: { row: 0, column: 0 },
		end: { row: 1, column: 1 },
	});
	assertEquals(result, [
		["A0", "A0", "C0"],
		["A0", "A0", "C1"],
		["A2", "B2", "C2"],
	]);
});

Deno.test("CssGridModule.copyRegion - should throw an error if start point is out of bounds", async () => {
	const regions = [
		["A0", "B0", "C0"],
		["A1", "B1", "C1"],
		["A2", "B2", "C2"],
	];
	await assertThrowsAsync(
		() => CssGridModule.copy_region({
			regions,
			start: { row: -1, column: 0 },
			end: { row: 1, column: 1 },
		}),
		Error,
		"CssGridModule.copyRegion: Start point is out of bounds",
	);
});

Deno.test("CssGridModule.copyRegion - should throw an error if end point is out of bounds", async () => {
	const regions = [
		["A0", "B0", "C0"],
		["A1", "B1", "C1"],
		["A2", "B2", "C2"],
	];
	await assertThrowsAsync(
		() => CssGridModule.copy_region({
			regions,
			start: { row: 0, column: 0 },
			end: { row: 3, column: 1 },
		}),
		Error,
		"CssGridModule.copyRegion: End point is out of bounds",
	);
});

Deno.test("CssGridModule.copyRegion - should copy a region to a non-square area", async () => {
	const regions = [
		["A0", "B0", "C0"],
		["A1", "B1", "C1"],
		["A2", "B2", "C2"],
	];
	const result = await CssGridModule.copy_region({
		regions,
		start: { row: 0, column: 1 },
		end: { row: 2, column: 2 },
	});
	assertEquals(result, [
		["A0", "B0", "B0"],
		["A1", "B0", "B0"],
		["A2", "B0", "B0"],
	]);
});

// -------------------------------------

Deno.test("CssGridModule.reset_region - should reset a single cell region", async () => {
	const regions = [
		["A0", "B0", "C0"],
		["A1", "B1", "C1"],
		["A2", "B2", "C2"],
	];
	const result = await CssGridModule.reset_region({
		regions,
		row: 1,
		column: 1,
	});
	assertEquals(result, [
		["A0", "B0", "C0"],
		["A1", "B1", "C1"],
		["A2", "B2", "C2"],
	]);
});

Deno.test("CssGridModule.reset_region - should reset a region to default value", async () => {
	const regions = [
		["A0", "A0", "C0"],
		["A0", "A0", "C1"],
		["A2", "B2", "C2"],
	];
	const result = await CssGridModule.reset_region({
		regions,
		row: 1,
		column: 1,
	});
	assertEquals(result, [
		["A0", "B0", "C0"],
		["A0", "B1", "C1"],
		["A2", "B2", "C2"],
	]);
});

Deno.test("CssGridModule.reset_region - should handle resetting the origin cell", async () => {
	const regions = [
		["A0", "A0", "C0"],
		["A0", "A0", "C1"],
		["A2", "B2", "C2"],
	];
	const result = await CssGridModule.reset_region({
		regions,
		row: 0,
		column: 0,
	});
	assertEquals(result, [
		["A0", "A0", "C0"],
		["A0", "A0", "C1"],
		["A2", "B2", "C2"],
	]);
});

Deno.test("CssGridModule.reset_region - center removal", async () => {
	const regions = [
		["A0", "B0", "B0", "B0"],
		["A1", "B0", "B0", "B0"],
		["A2", "B0", "B0", "B0"],
		["A3", "B3", "C3", "D3"],
		["A4", "B4", "C4", "D4"],
	];
	const result = await CssGridModule.reset_region({
		regions,
		row: 1,
		column: 3,
	});
	assertEquals(result, [
		["A0", "B0", "B0", "D0"],
		["A1", "B0", "B0", "D1"],
		["A2", "B0", "B0", "D2"],
		["A3", "B3", "C3", "D3"],
		["A4", "B4", "C4", "D4"],
	]);
});