
# EventsManager

The `EventsManager` class is designed to manage event listeners efficiently. It allows you to add, remove, and clear event listeners, including pointer and keyboard events. This document provides an overview of its methods and usage examples.

## Constructor

### `constructor()`

Initializes a new instance of the `EventsManager` class.

## Methods

### `addEvent(target, type, listener, options)`

Adds an event listener to the specified target.

- **Parameters:**
  - `target` (EventTarget): The target to which the event listener will be added.
  - `type` (string): The type of the event.
  - `listener` (EventListenerOrEventListenerObject): The event listener.
  - `options` (Object, optional): Optional options for the event listener.

### `addPointerEvent(target, type, listener, options)`

Adds a pointer event listener, including double-click.

- **Parameters:**
  - `target` (EventTarget): The target to which the event listener will be added.
  - `type` (string): The type of the event.
  - `listener` (EventListenerOrEventListenerObject): The event listener.
  - `options` (Object, optional): Optional options for the event listener.

### `addKeyboardEvent(target, type, listener, options)`

Adds a keyboard event listener.

- **Parameters:**
  - `target` (EventTarget): The target to which the event listener will be added.
  - `type` (string): The type of the event.
  - `listener` (EventListenerOrEventListenerObject): The event listener.
  - `options` (Object, optional): Optional options for the event listener.

### `addDoubleClickEvent(target, listener, options)`

Adds a double-click event listener.

- **Parameters:**
  - `target` (EventTarget): The target to which the event listener will be added.
  - `listener` (EventListenerOrEventListenerObject): The event listener.
  - `options` (Object, optional): Optional options for the event listener.

### `removeEvent(target, type, listener, options)`

Removes an event listener from the specified target.

- **Parameters:**
  - `target` (EventTarget): The target from which the event listener will be removed.
  - `type` (string): The type of the event.
  - `listener` (EventListenerOrEventListenerObject): The event listener.
  - `options` (Object, optional): Optional options for the event listener.

### `clearEvents()`

Clears all event listeners managed by the `EventsManager`.

### `dispose()`

Disposes the `EventsManager` and removes all event listeners.

## Usage Example

```javascript
import { EventsManager } from './path/to/events-manager.js';

const eventsManager = new EventsManager();
const button = document.querySelector('button');

function handleClick(event) {
    console.log('Button clicked!', event);
}

// Add a click event listener
eventsManager.addEvent(button, 'click', handleClick);

// Remove the click event listener
eventsManager.removeEvent(button, 'click', handleClick);

// Dispose the events manager
eventsManager.dispose();
```

