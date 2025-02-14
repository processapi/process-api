import { assertEquals, assert } from "https://deno.land/std@0.194.0/testing/asserts.ts";
import "./../../../src/system/logger.js";

Deno.test("Logger should log error messages", () => {
    logger.clear();
    logger.error("Test error message", "TestContext", { key: "value" });
    const logs = logger.logs;
    assertEquals(logs.length, 1);
    assertEquals(logs[0].message, "Test error message");
    assertEquals(logs[0].context, "TestContext");
    assertEquals(logs[0].data.key, "value");
    assertEquals(logs[0].level, "error");
});

Deno.test("Logger should log warning messages", () => {
    logger.clear();
    logger.warn("Test warn message", "TestContext", { key: "value" });
    const logs = logger.logs;
    assertEquals(logs.length, 1);
    assertEquals(logs[0].message, "Test warn message");
    assertEquals(logs[0].context, "TestContext");
    assertEquals(logs[0].data.key, "value");
    assertEquals(logs[0].level, "warn");
});

Deno.test("Logger should log info messages", () => {
    logger.clear();
    logger.info("Test info message", "TestContext", { key: "value" });
    const logs = logger.logs;
    assertEquals(logs.length, 1);
    assertEquals(logs[0].message, "Test info message");
    assertEquals(logs[0].context, "TestContext");
    assertEquals(logs[0].data.key, "value");
    assertEquals(logs[0].level, "info");
});

Deno.test("Logger should log debug messages", () => {
    logger.clear();
    logger.debug("Test debug message", "TestContext", { key: "value" });
    const logs = logger.logs;
    assertEquals(logs.length, 1);
    assertEquals(logs[0].message, "Test debug message");
    assertEquals(logs[0].context, "TestContext");
    assertEquals(logs[0].data.key, "value");
    assertEquals(logs[0].level, "debug");
});

Deno.test("Logger should clear all logs", () => {
    logger.clear();
    logger.error("Test error message");
    logger.warn("Test warn message");
    logger.info("Test info message");
    logger.debug("Test debug message");
    assertEquals(logger.logs.length, 4);
    logger.clear();
    assertEquals(logger.logs.length, 0);
});

Deno.test("Logger should clear error logs", () => {
    logger.clear();
    logger.error("Test error message");
    logger.warn("Test warn message");
    logger.info("Test info message");
    logger.debug("Test debug message");
    assertEquals(logger.logs.length, 4);
    logger.clearErrors();
    assertEquals(logger.logs.length, 3);
    assert(logger.logs.every(log => log.level !== "error"));
});

Deno.test("Logger should clear logs by context", () => {
    logger.clear();
    logger.error("Test error message", "Context1");
    logger.warn("Test warn message", "Context2");
    logger.info("Test info message", "Context1");
    logger.debug("Test debug message", "Context2");
    assertEquals(logger.logs.length, 4);
    logger.clearContext("Context1");
    assertEquals(logger.logs.length, 2);
    assert(logger.logs.every(log => log.context !== "Context1"));
});

Deno.test("Logger should clear logs by context and data", () => {
    logger.clear();
    logger.error("Test error message", "Context1", { key: "value1" });
    logger.warn("Test warn message", "Context2", { key: "value2" });
    logger.info("Test info message", "Context1", { key: "value1" });
    logger.debug("Test debug message", "Context2", { key: "value2" });
    assertEquals(logger.logs.length, 4);
    logger.clearData("Context1", { key: "value1" });
    assertEquals(logger.logs.length, 2);
    assert(logger.logs.every(log => log.context !== "Context1" && log.data.key !== "value1"));
});