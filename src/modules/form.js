/**
 * FormModule provides utility methods to handle form data.
 */
class FormModule {
    static name = Object.freeze("form");

    /**
     * Create a dictionary from the form elements.
     * @param {FormElement} args.form
     * @returns {Object} Dictionary of form data.
     */
    static from(args) {
        const { form } = args;
        const data = new FormData(form);
        const dict = {};
        
        for (const [key, value] of data.entries()) {
            dict[key] = value;
        }

        return dict;
    }

    /**
     * Populate form elements with data from a dictionary.
     * @param {FormElement} args.form
     * @param {Object} args.data
     */
    static to(args) {
        const { form, data } = args;

        for (const [key, value] of Object.entries(data)) {
            const element = form.querySelector(`[name="${key}"]`);

            if (element) {
                element.value = value;
            }
        }
    }

    /**
     * Set a specific form element's value.
     * @param {FormElement} args.form
     * @param {string} args.property
     * @param {string} args.value
     */
    static set(args) {
        const { form, property, value } = args;
        const element = form.querySelector(`[name="${property}"]`);
        element.value = value;
    }

    /**
     * Clear the form elements.
     * @param {FormElement} args.form
     */
    static clear(args) {
        const { form } = args;
        form.reset();
    }

    /**
     * Submit the form.
     * @param {FormElement} args.form
     */
    static submit(args) {
        const { form } = args;
        form.submit();
    }
}

export { FormModule };