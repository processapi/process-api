import { assertEquals, assert } from "jsr:@std/assert";
import { EventsManager } from "../../../src/system/events-manager.js";

// Mock PointerEvent if it does not exist
if (typeof PointerEvent === "undefined") {
    globalThis.PointerEvent = class extends Event {};
}

Deno.test("EventsManager: Add event listener", () => {
    const em = new EventsManager();
    const target = new EventTarget();
    const listener = () => {};
    
    em.addEvent(target, "click", listener);
    
    assert(em.events.has(target));
    assertEquals(em.events.get(target).length, 1);
    assertEquals(em.events.get(target)[0].type, "click");
    assertEquals(em.events.get(target)[0].listener, listener);
});

Deno.test("EventsManager: Remove event listener", () => {
    const em = new EventsManager();
    const target = new EventTarget();
    const listener = () => {};
    
    em.addEvent(target, "click", listener);
    em.removeEvent(target, "click", listener);
    
    assert(em.events.has(target));
    assertEquals(em.events.get(target).length, 0);
});

Deno.test("EventsManager: Clear all events", () => {
    const em = new EventsManager();
    const target1 = new EventTarget();
    const target2 = new EventTarget();
    const listener = () => {};
    
    em.addEvent(target1, "click", listener);
    em.addEvent(target2, "click", listener);
    em.clearEvents();
    
    assertEquals(em.events.size, 0);
});

Deno.test("EventsManager: Dispose", () => {
    const em = new EventsManager();
    const target = new EventTarget();
    const listener = () => {};
    
    em.addEvent(target, "click", listener);
    em.dispose();
    
    assertEquals(em.events.size, 0);
});

Deno.test("EventsManager: Add pointer event listener", () => {
    const em = new EventsManager();
    const target = new EventTarget();
    const listener = () => {};
    
    const eventType = "mousedown";
    em.addPointerEvent(target, eventType, listener);
    
    assert(em.events.has(target));
    assertEquals(em.events.get(target).length, 1);
    assertEquals(em.events.get(target)[0].type, eventType);
    assertEquals(em.events.get(target)[0].listener, listener);
});

Deno.test("EventsManager: Add pointer event listener on mobile", () => {
    const em = new EventsManager();
    const target = new EventTarget();
    const listener = () => {};
    
    globalThis.MOBILE_ENV = true;
    em.addPointerEvent(target, "click", listener);
    delete globalThis.MOBILE_ENV;
    
    assert(em.events.has(target));
    assertEquals(em.events.get(target).length, 1);
    assertEquals(em.events.get(target)[0].type, "touchend");
    assertEquals(em.events.get(target)[0].listener, listener);
});

Deno.test("EventsManager: Add keyboard event listener", () => {
    const em = new EventsManager();
    const target = new EventTarget();
    const listener = () => {};
    
    em.addKeyboardEvent(target, "keydown", listener);
    
    assert(em.events.has(target));
    assertEquals(em.events.get(target).length, 1);
    assertEquals(em.events.get(target)[0].type, "keydown");
    assertEquals(em.events.get(target)[0].listener, listener);
});