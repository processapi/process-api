import { EventsManager } from "./../../../src/system/events-manager.js";

/**
 * Initialize input events for the menu container.
 * @param {HTMLElement} container - The menu container element.
 */
export function initializeInput(container) {
    container.eventsManager = new EventsManager();
    container.eventsManager.addPointerEvent(container, "click", menuItemCliced.bind(container));
    document.addEventListener("click", handleClickOutside.bind(container));
}

/**
 * Close all expanded menu groups.
 * @this {HTMLElement}
 */
function closeAllGroups() {
    const expandedGroups = this.querySelectorAll("menu-item[aria-expanded='true']");
    expandedGroups.forEach((item) => {
        item.removeAttribute("aria-expanded");
        item.parentElement.showSubMenu(false);
    });
    setSelectedItem.call(this, null);
}

/**
 * Handle menu item click events.
 * @param {Event} event - The click event.
 * @this {HTMLElement}
 */
function menuItemCliced(event) {
    event.preventDefault();
    event.stopPropagation();
    const element = event.target;
    const parent = element.parentElement;

    if (element.tagName === "MENU-ITEM") {
        if (element.getAttribute("value") != null) {
            this.dispatchEvent(new CustomEvent("selected", { detail: element.getAttribute("value") }));
            return closeAllGroups.call(this);
        }

        if (parent.tagName === "MENU-GROUP") {
            const isExpanded = element.getAttribute("aria-expanded") === "true";
            element.setAttribute("aria-expanded", !isExpanded);
            parent.showSubMenu(!isExpanded);
        }
    }

    setSelectedItem.call(this, element);
}

/**
 * Handle clicks outside the menu to close all groups.
 * @param {Event} event - The click event.
 * @this {HTMLElement}
 */
function handleClickOutside(event) {
    if (!this.contains(event.target)) {
        closeAllGroups.call(this);
    }
}

/**
 * Set the selected menu item.
 * @param {HTMLElement} element - The menu item element to select.
 * @this {HTMLElement}
 */
function setSelectedItem(element) {
    const selected = this.querySelector("menu-item[aria-selected]");

    if (selected) {
        selected.removeAttribute("aria-selected");
    }

    if (element == null) return;

    if (element.tagName === "MENU-ITEM") {
        element.setAttribute("aria-selected", "true");
    }
}