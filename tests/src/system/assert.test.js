import { assert as customAssert } from '../../../src/system/assert.js';
import { assertEquals } from "https://deno.land/std@0.194.0/testing/asserts.ts";

Deno.test('should return true when condition is true', () => {
    const logger = {
        error: () => {}
    };
    globalThis.logger = logger;
    const result = customAssert(true, 'This should not log an error');
    assertEquals(result, true);
    delete globalThis.logger;
});

Deno.test('should return false and log error when condition is false', () => {
    const logger = {
        error: (message, context, data) => {
            assertEquals(message, 'This should log an error');
            assertEquals(context, 'context');
            assertEquals(data, { key: 'value' });
        }
    };
    globalThis.logger = logger;
    const result = customAssert(false, 'This should log an error', 'context', { key: 'value' });
    assertEquals(result, false);
    delete globalThis.logger;
});

Deno.test('should return false and log error with default context and data', () => {
    const logger = {
        error: (message, context, data) => {
            assertEquals(message, 'This should log an error');
            assertEquals(context, '');
            assertEquals(data, null);
        }
    };
    globalThis.logger = logger;
    const result = customAssert(false, 'This should log an error');
    assertEquals(result, false);
    delete globalThis.logger;
});

Deno.test('should not throw error if logger is not defined', () => {
    delete globalThis.logger;
    const result = customAssert(false, 'This should not throw');
    assertEquals(result, false);
});

