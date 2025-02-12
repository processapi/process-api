/**
 * @function validateArgs
 * @description This function is used by modules to validate arguments.
 * Are the arguments provided?
 * What argument properties are required?
 * What type should the argument be?
 * What is the default value for the argument?
 *
 * You only need to set the required property to true if the argument is required.
 * @param args {object} arguments to validate
 * @param def {object} definition of the arguments
 * @param prefix {string} prefix for the error message
 * @returns {void}
 *
 * @example
 * validateArgs(args, {
 *    view: { type: 'string', required: true },
 *    data: { type: 'object', default: {} },
 *    container: { type: 'HTMLElement', required: true }
 * });
 */

export function validateArgs(args, def, prefix = "") {
	if (!args) {
		throw new Error(`${prefix}Arguments are required`.trim());
	}

	for (const key in def) {
		const arg = def[key];
		const value = args[key];

		if (arg.required && value == null) {
			throw new Error(`${prefix}Argument "${key}" is required`.trim());
		}

		if (value != null) {
			const expectedType = arg.type.toLowerCase();
			const actualType = typeof value === "object"
				? value.constructor?.name.toLowerCase()
				: typeof value;

			const globalType = globalThis[arg.type ?? ""];
			if (actualType !== expectedType && !(globalType != null && value instanceof globalType)) {
				throw new Error(
					`${prefix}Argument "${key}" should be of type "${arg.type}"`.trim(),
				);
			}
		} else if (arg.default != null) {
			args[key] = arg.default;
		}
	}
}
