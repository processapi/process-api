import { assertEquals } from "jsr:@std/assert";
import { is } from "../../../src/validate/conditions.js";

Deno.test("is.null / is.not.null", () => {
  assertEquals(is.null(null), true);
  assertEquals(is.null(""), false);
  assertEquals(is.not.null(null), false);
  assertEquals(is.not.null("something"), true);
});

Deno.test("is.string", () => {
  assertEquals(is.string("test"), true);
  assertEquals(is.string(123), false);
});

Deno.test("is.number", () => {
  assertEquals(is.number(123), true);
  assertEquals(is.number("123"), false);
});

Deno.test("is.object", () => {
  assertEquals(is.object({}), true);
  assertEquals(is.object([]), false);
});

Deno.test("is.function", () => {
  assertEquals(is.function(() => {}), true);
  assertEquals(is.function({}), false);
});

Deno.test("is.array", () => {
  assertEquals(is.array([]), true);
  assertEquals(is.array({}), false);
});

Deno.test("is.boolean", () => {
  assertEquals(is.boolean(true), true);
  assertEquals(is.boolean("true"), false);
});

Deno.test("is.regexp", () => {
  assertEquals(is.regexp(/abc/), true);
  assertEquals(is.regexp("abc"), false);
});

Deno.test("is.date", () => {
  assertEquals(is.date(new Date()), true);
  assertEquals(is.date("2021-01-01"), false);
});

Deno.test("is.instanceOf", () => {
  class Example {}
  assertEquals(is.instanceOf(new Example(), Example), true);
  assertEquals(is.instanceOf({}, Example), false);
});

Deno.test("is.symbol", () => {
  assertEquals(is.symbol(Symbol()), true);
  assertEquals(is.symbol("not a symbol"), false);
});

Deno.test("is.type", () => {
  assertEquals(is.type("hello", "string"), true);
  assertEquals(is.type(123, "string"), false);
});

Deno.test("is.equal / is.not.equal", () => {
  assertEquals(is.equal(5, 5), true);
  assertEquals(is.equal(5, "5"), false);
  assertEquals(is.not.equal(5, 6), true);
  assertEquals(is.not.equal(5, 5), false);
});

Deno.test("is.empty / is.not.empty", () => {
  assertEquals(is.empty(""), true);
  assertEquals(is.empty([]), true);
  assertEquals(is.empty("abc"), false);
  assertEquals(is.not.empty([]), false);
  assertEquals(is.not.empty(["item"]), true);
});

Deno.test("is.truthy / is.falsy", () => {
  assertEquals(is.true(1 == 1), true);
  assertEquals(is.true("true"), true);
  assertEquals(is.true(1 == 0), false);
  assertEquals(is.true(null), false);

  assertEquals(is.false(1 != 1), true);
  assertEquals(is.false("false"), true);
  assertEquals(is.false(1 == 0), true);
  assertEquals(is.false(null), false);
});

Deno.test("is.between / is.not.between", () => {
  assertEquals(is.between(5, 1, 10), true);
  assertEquals(is.between(15, 1, 10), false);
  assertEquals(is.not.between(15, 1, 10), true);
  assertEquals(is.not.between(5, 1, 10), false);
});

Deno.test("is.greater / is.less", () => {
  assertEquals(is.greater(10, 5), true);
  assertEquals(is.less(3, 4), true);
});

Deno.test("is.oneOf", () => {
  assertEquals(is.oneOf("apple", ["apple", "banana"]), true);
  assertEquals(is.oneOf("pear", ["apple", "banana"]), false);
});

