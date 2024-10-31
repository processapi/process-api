/**
 * @class SystemModule
 * @description The system module provides methods that are system related.
 * This includes features such as are we on mobile ...?
 */
export class SystemModule {
	/**
	 * @property name
	 * @type {string}
	 * @static
	 * @description Name of the module
	 */
	static name = Object.freeze("view_loader");

    /**
     * @method isMobile
     * @description Check if the user is on a mobile device
     * @returns {boolean}
     *
     * @example
     * const isMobile = SystemModule.is_mobile();
     */
    static is_mobile() {
        return /Mobi/.test(navigator.userAgent);
    }
}