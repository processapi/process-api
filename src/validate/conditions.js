/**
 * // Null Checking
 * is.not.null(value)               // value is not null or undefined
 * is.null(value)                   // value is null or undefined
 * 
 * // Type Checking                 // value is not null and of the specified type
 * is.string(value)                 // value is a string
 * is.number(value)                 // value is a number
 * is.object(value)                 // value is an object
 * is.function(value)               // value is a function
 * is.array(value)                  // value is an array
 * is.boolean(value)                // value is a boolean
 * is.regexp(value)                 // value is a regular expression
 * is.date(value)                   // value is a date
 * is.instanceOf(value, constructor) // value is an instance of the constructor
 * is.symbol(value)                 // value is a symbol
 * is.type(value, type)             // value is of the specified type
 * 
 * // Value Checking                // value is not null and of the specified type
 * is.equal(value, other)           // value is equal to other
 * is.not.equal(value, other)       // value is not equal to other
 * is.empty(value)                  // value is a string or an array and is empty
 * is.not.empty(value)              // value is a string or an array and is not empty
 * is.truthy(value)                 // value is truthy
 * is.falsy(value)                  // value is falsy
 * is.between(value, min, max)      // value is between min and max
 * is.not.between(value, min, max)  // value is not between min and max
 * is.greater(value, other)         // value is greater than other
 * is.less(value, other)            // value is not greater than other
 * is.oneOf(value, array)           // value is one of the elements in the array
 */

const is = {
  null: (val) => val == null,
  not: {
    null: (val) => val != null
  },
  string: (val) => val != null && typeof val === 'string',
  number: (val) => val != null && typeof val === 'number',
  object: (val) => val != null && typeof val === 'object' && !Array.isArray(val),
  function: (val) => val != null && typeof val === 'function',
  array: (val) => Array.isArray(val),
  boolean: (val) => val === true || val === false,
  regexp: (val) => val instanceof RegExp,
  date: (val) => val instanceof Date,
  instanceOf: (val, ctor) => val instanceof ctor,
  symbol: (val) => typeof val === 'symbol',
  type: (val, type) => typeof val === type,
  equal: (val, other) => val === other,
  empty: (val) => (typeof val === 'string' || Array.isArray(val)) && val.length === 0,
  true: (val) => val === true || val === "true",
  false: (val) => val === false || val === "false",
  between: (val, min, max) => val > min && val < max,
  greater: (val, other) => val > other,
  less: (val, other) => val < other,
  oneOf: (val, arr) => arr.includes(val)
};

// Negated checks
is.not.equal = (val, other) => !is.equal(val, other);
is.not.empty = (val) => !is.empty(val);
is.not.between = (val, min, max) => !is.between(val, min, max);

export { is };