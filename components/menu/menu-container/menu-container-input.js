import { EventsManager } from "./../../../src/system/events-manager.js";

export function initializeInput(container) {
    container.eventsManager = new EventsManager();
    container.eventsManager.addPointerEvent(container, "click", menuItemCliced.bind(container));
    document.addEventListener("click", handleClickOutside.bind(container));
}

function closeAllGroups() {
    const expandedGroups = this.querySelectorAll("menu-item[aria-expanded='true']");
    expandedGroups.forEach((item) => {
        item.removeAttribute("aria-expanded");
        item.parentElement.showSubMenu(false);
    });
}

function menuItemCliced(event) {
    event.preventDefault();
    event.cancelBubble = true;
    const element = event.target;
    const parent = element.parentElement;

    if (element.tagName === "MENU-ITEM") {
        if (parent.tagName === "MENU-GROUP") {
            const isExpanded = element.getAttribute("aria-expanded") === "true";
            element.setAttribute("aria-expanded", !isExpanded);
            parent.showSubMenu(!isExpanded);
        }
    }
}

function handleClickOutside(event) {
    if (!this.contains(event.target)) {
        closeAllGroups.call(this);
    }
}