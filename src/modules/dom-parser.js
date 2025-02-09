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
     * @param {Object} dictionary - The dictionary to replace markers.
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
    static parse_element(element, dictionary, parseChildren = true) {
        if (element == null || dictionary == null) return;
        parseElement(element, dictionary, parseChildren);
    }
}

/**
 * @function parseElement
 * @description Parse an element and its children.
 * @param {HTMLElement} element - The element to parse.
 * @param {Object} dictionary - The dictionary to replace markers.
 */
function parseElement(element, dictionary, parseChildren) {
    if (element == null || dictionary == null) return;

    // replace text content markers
    if (element.children?.length === 0) {
        replaceTextContentMarkers(element, dictionary);
    }
    
    // replace attribute value markers
    replaceAttributeMarkers(element.attributes, dictionary);

    // parse child elements
    if (parseChildren) {
        parseChildElements(element.children, dictionary);
    }
}

/**
 * @function replaceTextContentMarkers
 * @description Replace text content markers in an element.
 * @param {HTMLElement} element - The element to parse.
 * @param {Object} dictionary - The dictionary to replace markers.
 */
function replaceTextContentMarkers(element, dictionary) {
    if (element == null || dictionary == null) return;

    element.textContent = replaceMarkers(element.textContent, dictionary);
}

/**
 * @function replaceAttributeMarkers
 * @description Replace attribute value markers in an element.
 * @param {NamedNodeMap} attributes - The attributes to parse.
 * @param {Object} dictionary - The dictionary to replace markers.
 */
function replaceAttributeMarkers(attributes, dictionary) {
    if (attributes == null || dictionary == null) return;

    for (let i = 0; i < attributes.length; i++) {
        const attribute = attributes[i];
        attribute.value = replaceMarkers(attribute.value, dictionary);
    }
}

/**
 * @function replaceMarkers
 * @description Replace markers in a text using a dictionary.
 * @param {String} text - The text to replace markers.
 * @param {Object} dictionary - The dictionary to replace markers.
 * @returns {String} - The text with replaced markers.
 */
function replaceMarkers(text, dictionary) {
    if (text == null || dictionary == null) return text;

    return text.replace(/\$\{([^}]+)\}/g, (_, key) => {
        const keys = key.split('.').map(k => k.trim());
        let value = dictionary;
        for (const k of keys) {
            value = value[k];
            if (value == null) return '';
        }
        return value;
    });
}

/**
 * @function parseChildElements
 * @description Parse the children of an element.
 * @param {HTMLCollection} children - The children to parse.
 * @param {Object} dictionary - The dictionary to replace markers.
 */
function parseChildElements(children, dictionary) {
    if (children == null || dictionary == null) return;

    // recursively parse each child element
    for (let i = 0; i < children.length; i++) {
        const element = children[i];
        parseElement(element, dictionary, true);
    }
}

export { DomParserModule };