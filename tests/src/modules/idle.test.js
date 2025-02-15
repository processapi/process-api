import { assertEquals, assert } from "jsr:@std/assert";
import { IdleModule } from "../../../src/modules/idle.js";

// Mock requestIdleCallback and cancelIdleCallback
globalThis.requestIdleCallback = (callback) => {
    const id = setTimeout(() => {
        callback({ timeRemaining: () => 50, didTimeout: false });
        clearTimeout(id);
    }, 0);
    return id;
};

globalThis.cancelIdleCallback = (id) => {
    clearTimeout(id);
};

Deno.test("IdleWorker should execute tasks when idle", async () => {
    let taskExecuted = false;
    const task = () => { taskExecuted = true; };

    IdleModule.perform({ tasks: [task] });

    // Simulate idle period
    await new Promise(resolve => {
        const id = requestIdleCallback(() => {
            assert(taskExecuted, "Task should have been executed during idle period");
            cancelIdleCallback(id); // Clear the timeout to prevent leaks
            resolve();
        });
    });
});

Deno.test("IdleWorker should execute multiple tasks when idle", async () => {
    let task1Executed = false;
    let task2Executed = false;
    const task1 = () => { task1Executed = true; };
    const task2 = () => { task2Executed = true; };

    IdleModule.perform({ tasks: [task1, task2] });

    // Simulate idle period
    await new Promise(resolve => {
        const id = requestIdleCallback((deadline) => {
            assert(task1Executed, "Task 1 should have been executed during idle period");
            assert(task2Executed, "Task 2 should have been executed during idle period");
            cancelIdleCallback(id); // Clear the timeout to prevent leaks
            resolve();
        });
    });
});

Deno.test("IdleWorker should handle empty task list", async () => {
    IdleModule.perform({ tasks: [] });

    // Simulate idle period
    await new Promise(resolve => {
        const id = requestIdleCallback((deadline) => {
            assertEquals(globalThis.idleWorker.count, 0, "Queue should be empty");
            cancelIdleCallback(id); // Clear the timeout to prevent leaks
            resolve();
        });
    });
});

