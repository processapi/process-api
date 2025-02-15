import { assertEquals } from "jsr:@std/assert";
import { TweenModule } from "./../../../src/modules/tween.js";

const tween = new TweenModule();

Deno.test("linear tween function", () => {
    assertEquals(tween.linear(0, 0, 100, 1), 0);
    assertEquals(tween.linear(0.5, 0, 100, 1), 50);
    assertEquals(tween.linear(1, 0, 100, 1), 100);
});

Deno.test("easeInQuad tween function", () => {
    assertEquals(tween.easeInQuad(0, 0, 100, 1), 0);
    assertEquals(tween.easeInQuad(0.5, 0, 100, 1), 25);
    assertEquals(tween.easeInQuad(1, 0, 100, 1), 100);
});

Deno.test("easeOutQuad tween function", () => {
    assertEquals(tween.easeOutQuad(0, 0, 100, 1), 0);
    assertEquals(tween.easeOutQuad(0.5, 0, 100, 1), 75);
    assertEquals(tween.easeOutQuad(1, 0, 100, 1), 100);
});

Deno.test("easeInOutQuad tween function", () => {
    assertEquals(tween.easeInOutQuad(0, 0, 100, 1), 0);
    assertEquals(tween.easeInOutQuad(0.25, 0, 100, 1), 12.5);
    assertEquals(tween.easeInOutQuad(0.5, 0, 100, 1), 50);
    assertEquals(tween.easeInOutQuad(0.75, 0, 100, 1), 87.5);
    assertEquals(tween.easeInOutQuad(1, 0, 100, 1), 100);
});

Deno.test("easeInCubic tween function", () => {
    assertEquals(tween.easeInCubic(0, 0, 100, 1), 0);
    assertEquals(tween.easeInCubic(0.5, 0, 100, 1), 12.5);
    assertEquals(tween.easeInCubic(1, 0, 100, 1), 100);
});

Deno.test("easeOutCubic tween function", () => {
    assertEquals(tween.easeOutCubic(0, 0, 100, 1), 0);
    assertEquals(tween.easeOutCubic(0.5, 0, 100, 1), 87.5);
    assertEquals(tween.easeOutCubic(1, 0, 100, 1), 100);
});

Deno.test("easeInOutCubic tween function", () => {
    assertEquals(tween.easeInOutCubic(0, 0, 100, 1), 0);
    assertEquals(tween.easeInOutCubic(0.25, 0, 100, 1), 6.25);
    assertEquals(tween.easeInOutCubic(0.5, 0, 100, 1), 50);
    assertEquals(tween.easeInOutCubic(0.75, 0, 100, 1), 93.75);
    assertEquals(tween.easeInOutCubic(1, 0, 100, 1), 100);
});