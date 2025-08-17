/**
 * Falsy check that also includes empty array as true, and 0 as false
 *
 * ```ts
 * isFalsyOrEmpty("hello") => false
 * isFalsyOrEmpty([1,2,3]) => false
 * isFalsyOrEmpty(null) => true
 * isFalsyOrEmpty([]) => true
 * isFalsyOrEmpty(0) => false
 * ```
 *
 * @param value
 * @returns {boolean} `true` if the value is falsy or an empty array, otherwise `false`.
 */
export const isFalsyOrEmpty = (
  value: unknown
): value is null | undefined | false | "" | [] => {
  return (
    value === null ||
    value === undefined ||
    value === false ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  );
};

/**
 * Checks if a given value is a function.
 *
 * Examples:
 * ```ts
 * isFunction(() => {}) // true
 * isFunction(function test() {}) // true
 * isFunction(123) // false
 * isFunction({}) // false
 * ```
 *
 * @param {any} object - The value to check.
 * @returns {boolean} `true` if the value is a function, otherwise `false`.
 */
export const isFunction = (object: unknown): object is Function =>
  typeof object === "function";

/**
 * Checks whether a value is `null` or `undefined`.
 *
 * This is similar to the `== null` check in JavaScript,
 * but written explicitly for clarity.
 *
 * Examples:
 * ```ts
 * isNullish(null);        // true
 * isNullish(undefined);   // true
 * isNullish(0);           // false
 * isNullish("");          // false
 * isNullish(false);       // false
 * ```
 *
 * @param {any} value - The value to check.
 * @returns {boolean} `true` if the value is `null` or `undefined`, otherwise `false`.
 */
export const isNullish = (value: unknown): value is null | undefined =>
  value === undefined || value === null;
