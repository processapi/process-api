/**
 * This class manages events.
 * You can add and remove events.
 * It also allows you to clear all events.
 * Pointer events will be managed based on mobility, so you don't have to worry about it.
 * When you dispose the class, all events will be removed.
 */

import { SystemModule } from "../modules/system.js";

export class EventsManager {
    constructor() {
        this.events = new Map();
    }

    /**
     * Adds an event listener.
     * @param {EventTarget} target - The target to which the event listener will be added.
     * @param {string} type - The type of the event.
     * @param {EventListenerOrEventListenerObject} listener - The event listener.
     * @param {Object} [options] - Optional options for the event listener.
     */
    addEvent(target, type, listener, options) {
        if (!this.events.has(target)) {
            this.events.set(target, []);
        }
        this.events.get(target).push({ type, listener, options });
        target.addEventListener(type, listener, options);
    }

    /**
     * Adds a pointer event listener, including double-click.
     * @param {EventTarget} target - The target to which the event listener will be added.
     * @param {string} type - The type of the event.
     * @param {EventListenerOrEventListenerObject} listener - The event listener.
     * @param {Object} [options] - Optional options for the event listener.
     */
    addPointerEvent(target, type, listener, options) {
        let eventType;
        if (SystemModule.is_mobile()) {
            eventType = `touch${type}`;
        } else {
            eventType = PointerEvent ? type : `mouse${type}`;
        }
        this.addEvent(target, eventType, listener, options);
    }

    /**
     * Adds a keyboard event listener.
     * @param {EventTarget} target - The target to which the event listener will be added.
     * @param {string} type - The type of the event.
     * @param {EventListenerOrEventListenerObject} listener - The event listener.
     * @param {Object} [options] - Optional options for the event listener.
     */
    addKeyboardEvent(target, type, listener, options) {
        this.addEvent(target, type, listener, options);
    }

    /**
     * Adds a double-click event listener.
     * @param {EventTarget} target - The target to which the event listener will be added.
     * @param {EventListenerOrEventListenerObject} listener - The event listener.
     * @param {Object} [options] - Optional options for the event listener.
     */
    addDoubleClickEvent(target, listener, options) {
        this.addEvent(target, 'dblclick', listener, options);
    }

    /**
     * Removes an event listener.
     * @param {EventTarget} target - The target from which the event listener will be removed.
     * @param {string} type - The type of the event.
     * @param {EventListenerOrEventListenerObject} listener - The event listener.
     * @param {Object} [options] - Optional options for the event listener.
     */
    removeEvent(target, type, listener, options) {
        if (this.events.has(target)) {
            const targetEvents = this.events.get(target);
            const index = targetEvents.findIndex(event => event.type === type && event.listener === listener && event.options === options);
            if (index !== -1) {
                targetEvents.splice(index, 1);
                target.removeEventListener(type, listener, options);
            }
        }
    }

    /**
     * Clears all events.
     */
    clearEvents() {
        for (const [target, targetEvents] of this.events.entries()) {
            for (const { type, listener, options } of targetEvents) {
                target.removeEventListener(type, listener, options);
            }
        }
        this.events.clear();
    }

    /**
     * Disposes the events manager and removes all events.
     */
    dispose() {
        this.clearEvents();
    }
}