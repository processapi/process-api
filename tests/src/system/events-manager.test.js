import { assertEquals, assert } from "https://deno.land/std@0.194.0/testing/asserts.ts";
import { EventsManager } from "../../../src/system/events-manager.js";

// Mock PointerEvent if it does not exist
if (typeof PointerEvent === "undefined") {
    globalThis.PointerEvent = class extends Event {};
}

// Mock SystemModule
const SystemModule = {
    is_mobile: () => false,
};

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
    
    em.addPointerEvent(target, "down", listener);
    
    const eventType = PointerEvent ? "down" : "mousedown";
    assert(em.events.has(target));
    assertEquals(em.events.get(target).length, 1);
    assertEquals(em.events.get(target)[0].type, eventType);
    assertEquals(em.events.get(target)[0].listener, listener);
});

Deno.test("EventsManager: Add pointer event listener on mobile", () => {
    const em = new EventsManager();
    const target = new EventTarget();
    const listener = () => {};
    
    SystemModule.is_mobile = () => true;
    em.addPointerEvent(target, "start", listener);
    
    assert(em.events.has(target));
    assertEquals(em.events.get(target).length, 1);
    assertEquals(em.events.get(target)[0].type, "touchstart");
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