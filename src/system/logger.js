/**
 * logger.error('error message');
 * logger.warn('warn message');
 * logger.info('info message');
 * logger.debug('debug message');
 * 
 * @param {string} message - required
 * @param {context} string - optional default to ""
 * @param {data} any - optional default to null
 * 
 * Date is set to current date and time
 */

globalThis.LOG_LEVELS = {
    ERROR: 'error',
    WARN: 'warn',
    INFO: 'info',
    DEBUG: 'debug'
}

const LOG_STRUCT = {
    message: "",
    context: "",
    data: null,
    date: null
}

/**
 * @class Logger
 * @description Logger class to log messages
 * Messages are stored in a log array
 */
class Logger extends EventTarget {
    #items = [];

    /**
     * Internal method to handle log creation.
     * @param {string} level - Log level (ERROR, WARN, INFO, DEBUG)
     * @param {string} message - Main log message
     * @param {string} context - Additional context info
     * @param {any} data - Optional data payload
     */
    #log(level, message = "", context = "", data = null) {
        const entry = structuredClone(LOG_STRUCT);
        entry.message = message;
        entry.context = context;
        entry.data = data;
        entry.date = new Date().toISOString();
        entry.level = level;
        this.#items.push(entry);
    }

    /**
     * Returns all log entries.
     * @returns {Array}
     */
    get logs() {
        return this.#items;
    }

    /**
     * Returns all error log entries.
     * @returns {Array}
     */
    get errors() {
        return this.#items.filter(item => item.level === LOG_LEVELS.ERROR);
    }

    /**
     * Logs an error message.
     * @param {string} message
     * @param {string} context
     * @param {any} data
     */
    error(message, context, data) {
        this.#log(LOG_LEVELS.ERROR, message, context, data);
        this.dispatchEvent(new CustomEvent('error', { detail: { message, context, data } }));   
    }

    /**
     * Logs a warning message.
     * @param {string} message
     * @param {string} context
     * @param {any} data
     */
    warn(message, context, data) {
        this.#log(LOG_LEVELS.WARN, message, context, data);
    }

    /**
     * Logs an informational message.
     * @param {string} message
     * @param {string} context
     * @param {any} data
     */
    info(message, context, data) {
        this.#log(LOG_LEVELS.INFO, message, context, data);
    }

    /**
     * Logs a debug message.
     * @param {string} message
     * @param {string} context
     * @param {any} data
     */
    debug(message, context, data) {
        this.#log(LOG_LEVELS.DEBUG, message, context, data);
    }

    /**
     * Clears all log entries
     * @returns {void}
     */
    clear() {
        this.#items = [];
    }

    /**
     * Clears all error log entries
     * @returns {void}
     */
    clearErrors() {
        this.#items = this.#items.filter(item => item.level !== LOG_LEVELS.ERROR);
    }

    /**
     * Clears all log entries with the specified context
     * @param {string} context
     * @returns {void}
     */
    clearContext(context) {
        this.#items = this.#items.filter(item => item.context !== context);
    }

    /**
     * Clears all log entries with the specified context and data
     * @param {string} context
     * @param {any} data
     * @returns {void}
     */
    clearData(context, data) {
        this.#items = this.#items.filter(item => item.context !== context && item.data !== data);
    }
}

globalThis.logger = new Logger();