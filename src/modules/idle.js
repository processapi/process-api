import { validateArgs } from "./../validate/validate-args.js";

export class IdleModule {
    static name = Object.freeze("idle");

    static perform(args) {
        validateArgs(args, {
            tasks: { type: "Array", required: true }
        }, "IdleModule.initialize: ");

        return globalThis.idleWorker.perform(args.tasks);
    }
}

/**
 * This class is responsible for executing tasks when the browser is idle.
 * It maintains a queue of tasks to be executed when the browser is idle.
 */
class IdleWorker {
    #queue = [];
    #idleCallbackId = null;

    get count() {
        return this.#queue.length;
    }

    /**
     * Perform the first task in the queue.
     * @returns
     */
    #performFirstTask(deadline) {
        while ((deadline.timeRemaining() > 0 || deadline.didTimeout) && this.#queue.length > 0) {
            const task = this.#queue.shift();
            task();
        }

        if (this.#queue.length > 0) {
            this.#idleCallbackId = requestIdleCallback(this.#performFirstTask.bind(this));
        } else {
            this.#idleCallbackId = null;
        }
    }

    perform(tasks) {
        this.#queue.push(...tasks);
        this.#startIdleTaskExecution();
    }

    #startIdleTaskExecution() {
        if (this.#idleCallbackId === null) {
            this.#idleCallbackId = requestIdleCallback(this.#performFirstTask.bind(this));
        }
    }
}

globalThis.idleWorker ||= new IdleWorker();