import { assertEquals, assert } from "https://deno.land/std@0.194.0/testing/asserts.ts";
import { QuadTree } from "./../../../../src/modules/quadtree/quadtree.js";

function pointsMatch(actual, expected) {
    return expected.every(exp => actual.some(act => act.x === exp.x && act.y === exp.y));
}

function pointExists(points, point) {
    return points.some(p => p.x === point.x && p.y === point.y);
}

Deno.test("QuadTree: Insert and query single point", () => {
    const boundary = { x: 0, y: 0, width: 100, height: 100 };
    const qt = new QuadTree(boundary, 4);

    qt.insert({ x: 10, y: 10 });
    const results = qt.query({ x: 0, y: 0, width: 20, height: 20 });

    assertEquals(results.length, 1);
    assert(pointExists(results, { x: 10, y: 10 }));
});

Deno.test("QuadTree: Insert multiple points and query within range", () => {
    const boundary = { x: 0, y: 0, width: 100, height: 100 };
    const qt = new QuadTree(boundary, 4);

    qt.insert({ x: 10, y: 10 });
    qt.insert({ x: 20, y: 20 });
    qt.insert({ x: 30, y: 30 });
    qt.insert({ x: 40, y: 40 });

    const results = qt.query({ x: 15, y: 15, width: 30, height: 30 });

    const expected = [{ x: 20, y: 20 }, { x: 30, y: 30 }, { x: 40, y: 40 }];

    assertEquals(results.length, expected.length);
    assert(pointsMatch(results, expected));
});

Deno.test("QuadTree: Ensure points outside query range are not returned", () => {
    const boundary = { x: 0, y: 0, width: 100, height: 100 };
    const qt = new QuadTree(boundary, 4);

    qt.insert({ x: 10, y: 10 });
    qt.insert({ x: 90, y: 90 });

    const results = qt.query({ x: 0, y: 0, width: 50, height: 50 });

    assertEquals(results.length, 1);
    assert(pointExists(results, { x: 10, y: 10 }));
});

Deno.test("QuadTree: Ensure splitting and querying work correctly", () => {
    const boundary = { x: 0, y: 0, width: 100, height: 100 };
    const qt = new QuadTree(boundary, 1);

    qt.insert({ x: 10, y: 10 });
    qt.insert({ x: 90, y: 90 });

    const resultsNW = qt.query({ x: 0, y: 0, width: 50, height: 50 });
    const resultsSE = qt.query({ x: 50, y: 50, width: 50, height: 50 });

    assertEquals(resultsNW.length, 1);
    assert(pointExists(resultsNW, { x: 10, y: 10 }));

    assertEquals(resultsSE.length, 1);
    assert(pointExists(resultsSE, { x: 90, y: 90 }));
});

Deno.test("QuadTree: Empty query returns no results", () => {
    const boundary = { x: 0, y: 0, width: 100, height: 100 };
    const qt = new QuadTree(boundary, 4);

    const results = qt.query({ x: 10, y: 10, width: 10, height: 10 });
    assertEquals(results.length, 0);
});

Deno.test("QuadTree: Query range exceeding boundaries", () => {
    const boundary = { x: 0, y: 0, width: 100, height: 100 };
    const qt = new QuadTree(boundary, 4);

    qt.insert({ x: 10, y: 10 });
    qt.insert({ x: 90, y: 90 });

    const results = qt.query({ x: -50, y: -50, width: 200, height: 200 });

    assertEquals(results.length, 2);
    assert(pointExists(results, { x: 10, y: 10 }));
    assert(pointExists(results, { x: 90, y: 90 }));
});

Deno.test("QuadTree: Move point and update position", () => {
    const boundary = { x: 0, y: 0, width: 100, height: 100 };
    const qt = new QuadTree(boundary, 4);

    qt.insert({ x: 10, y: 10 });
    qt.move({ x: 10, y: 10 }, { x: 20, y: 20 });

    const results = qt.query({ x: 0, y: 0, width: 100, height: 100 });

    assertEquals(results.length, 1);
    assert(pointExists(results, { x: 20, y: 20 }));
});

Deno.test("QuadTree: Move point outside query range", () => {
    const boundary = { x: 0, y: 0, width: 100, height: 100 };
    const qt = new QuadTree(boundary, 4);

    qt.insert({ x: 10, y: 10 });
    qt.move({ x: 10, y: 10 }, { x: 210, y: 210 });

    const results = qt.query({ x: 0, y: 0, width: 100, height: 100 });

    assertEquals(results.length, 0);
});