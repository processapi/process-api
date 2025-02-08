/**
 * @module DomParserModule
 * This module parses the DOM.
 * It looks for markers in the DOM as defined by the user.
 * When it finds a marker, it will call a defined callback.
 * The callback parameters arg will define the marker and the item it was found on, be it the element or attribute.
 * 
 * TextContent markers are defined as follows:
 * tc:marker - "tc" stands for text content. For example: "tc:$content"
 * an:marker - "an" stands for attribute name. For example: "an:.bind". The attribute name contains the marker.
 * av:marker - "av" stands for attribute value. For example: "av:$hidden". The attribute value contains the marker.
 */
class DomParserModule {
    static name = Object.freeze("dom-parser");

    /**
     * @function parse
     * @description Parse the DOM.
     * @param {HTMLElement} element - The element to parse.
     * @param {Object} markers - The markers to look for.
     * @param {Boolean} parseChildren - Whether to parse the children of the element.
     * @returns {Promise} - Returns a promise.
     * @static
     * @example
     * DomParserModule.parse(document.body, {
     *    "tc:$content": (arg) => {...},
     *    "an:.bind": (arg) => {...},
     *    "av:$hidden": (arg) => {...},
     * });
     */
    static parse_element(element, markers, parseChildren = true) {
        if (element == null || markers == null) return;

        // parse the markers into a lookup table
        const groupedMarkers = {};

        for (const marker in markers) {
            if (marker.startsWith("tc:")) {
                groupedMarkers.tc ||= {};
                groupedMarkers.tc[marker] = markers[marker];
            } else if (marker.startsWith("an:")) {
                groupedMarkers.an ||= {};
                groupedMarkers.an[marker] = markers[marker];
            } else if (marker.startsWith("av:")) {
                groupedMarkers.av ||= {};
                groupedMarkers.av[marker] = markers[marker];
            }
        }

        // parse the markers
        parseElement(element, groupedMarkers, parseChildren);
    }
}

/**
 * @function parseElement
 * @description Parse an element and its children.
 * @param {HTMLElement} element - The element to parse.
 * @param {Object} markers - The grouped markers to look for.
 */
function parseElement(element, markers, parseChildren) {
    if (element == null || markers == null) return;

    // parse text content markers
    parseTextContent(element, markers.tc);
    
    // parse attribute name and value markers
    parseAttributes(element.attributes, markers.an, markers.av);

    // parse child elements
    if (parseChildren) {
        parseChildElements(element.children, markers);
    }
}

/**
 * @function parseTextContent
 * @description Parse the text content of an element.
 * @param {HTMLElement} element - The element to parse.
 * @param {Object} markers - The markers to look for.
 */
function parseTextContent(element, markers) {
    if (element == null || markers == null) return;

    for (const [key, value] of Object.entries(markers)) {
        const marker = key.split(":")[1];
        const callback = value;

        if (element.textContent.includes(marker)) {
            callback({ marker, element });
        }
    }
}

/**
 * @function parseAttributes
 * @description Parse the attributes of an element.
 * @param {NamedNodeMap} attributes - The attributes to parse.
 * @param {Object} anMarkers - The attribute name markers to look for.
 * @param {Object} avMarkers - The attribute value markers to look for.
 */
function parseAttributes(attributes, anMarkers, avMarkers) {
    if (attributes == null || (anMarkers == null && avMarkers == null)) return;

    for (let i = 0; i < attributes.length; i++) {
        const attribute = attributes[i];

        // parse attribute name markers
        parseAttributeName(attribute, anMarkers);
        // parse attribute value markers
        parseAttributeValue(attribute, avMarkers);
    }
}

/**
 * @function parseAttributeName
 * @description Parse the name of an attribute.
 * @param {Attr} attribute - The attribute to parse.
 * @param {Object} markers - The markers to look for.
 */
function parseAttributeName(attribute, markers) {
    if (attribute == null || markers == null) return;

    for (const [key, value] of Object.entries(markers)) {
        const marker = key.split(":")[1];
        const callback = value;

        if (attribute.name.includes(marker)) {
            callback({ marker, attribute });
        }
    }
}

/**
 * @function parseAttributeValue
 * @description Parse the value of an attribute.
 * @param {Attr} attribute - The attribute to parse.
 * @param {Object} markers - The markers to look for.
 */
function parseAttributeValue(attribute, markers) {
    if (attribute == null || markers == null) return;

    for (const [key, value] of Object.entries(markers)) {
        const marker = key.split(":")[1];
        const callback = value;

        if (attribute.value.includes(marker)) {
            callback({ marker, attribute });
        }
    }
}

/**
 * @function parseChildElements
 * @description Parse the children of an element.
 * @param {HTMLCollection} children - The children to parse.
 * @param {Object} markers - The grouped markers to look for.
 */
function parseChildElements(children, markers) {
    if (children == null || markers == null) return;

    // recursively parse each child element
    children.forEach(element => {
        parseElement(element, markers);    
    });
}

export { DomParserModule };