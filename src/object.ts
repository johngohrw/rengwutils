/**
 * Creates a deep clone of a value by serializing it to JSON and then parsing it back. its unsafe(!)
 *
 * Only works reliably with JSON-serializable data (plain objects, arrays, numbers, strings, booleans, `null`).
 * Functions, `Date`, `Map`, `Set`, `undefined`, class instances, and other complex types are **not preserved**.
 *
 * Examples:
 * ```ts
 * deepClone({ a: 1, b: { c: 2 } });
 * // { a: 1, b: { c: 2 } }
 *
 * deepClone([1, 2, 3]);
 * // [1, 2, 3]
 *
 * deepClone({ d: new Date() });
 * // { d: "2025-08-17T07:12:34.000Z" }  <-- converted to string
 * ```
 *
 * @template T - The type of the input value.
 * @param {T} obj - The value to clone.
 * @returns {T} A deep clone of the input value.
 */
export const deepClone = <T>(obj: T) => {
  return JSON.parse(JSON.stringify(obj)) as T;
};

/**
 * Combines multiple objects into a single object, ignoring falsy values (`null`, `undefined`, `false`).
 * Later objects in the argument list overwrite properties of earlier ones.
 *
 * Examples:
 * ```ts
 * combine({ a: 1 }, { b: 2 });
 * // { a: 1, b: 2 }
 *
 * combine({ a: 1 }, null, { a: 3, c: 4 });
 * // { a: 3, c: 4 }
 *
 * combine(undefined, false, { x: 10 });
 * // { x: 10 }
 * ```
 *
 * @template T - The type of objects being merged.
 * @param {...(T | undefined | null | false)[]} objects - Objects to merge. Falsy values are ignored.
 * @returns {T} A new object with all properties from the provided objects.
 */
export const combine = <T = Record<string, any>>(
  ...objects: (T | undefined | null | false)[]
) =>
  objects.reduce((acc, curr) => {
    return !curr ? acc : { ...acc, ...curr };
  }, {}) as T;

/**
 * Creates a new object containing only the specified keys from the source object.
 *
 * Examples:
 * ```ts
 * const user = { id: 1, name: "Alice", age: 25 };
 * cherryPick(user, ["id", "name"]);
 * // { id: 1, name: "Alice" }
 *
 * cherryPick(user, ["age"]);
 * // { age: 25 }
 *
 * cherryPick(user, ["nonExistentKey"]);
 * // {}
 * ```
 *
 * @template T - The type of the source object.
 * @param {T} srcObj - The source object.
 * @param {(keyof T)[]} keys - The list of keys to extract from the source object.
 * @returns {Partial<T>} A new object containing only the picked keys (if present in `srcObj`).
 */
export const cherryPick = <T extends object = Record<string | number, any>>(
  srcObj: T,
  keys: (keyof T)[]
) =>
  keys.reduce((acc: Partial<T>, key) => {
    if (key in srcObj) {
      acc[key] = srcObj[key];
    }
    return acc;
  }, {});

/**
 * An unsafe variant of {@link cherryPick} that bypasses type safety by
 * forcing the source object type to `any`.
 *
 * This can be useful when the object shape is not known at compile time,
 * but it removes the type guarantees of the safe version.
 *
 * Examples:
 * ```ts
 * const obj = { a: 1, b: 2, c: 3 };
 *
 * // No type checking on the keys:
 * cherryPickUnsafe(obj, ["x", "y"]);
 * // {}
 *
 * // Still works as expected, but without strict typing:
 * cherryPickUnsafe(obj, ["a", "c"]);
 * // { a: 1, c: 3 }
 * ```
 *
 * @param {any} srcObj - The source object.
 * @param {string[]} keys - Keys to extract from the source object.
 * @returns {object} A new object containing only the picked keys.
 */
export const cherryPickUnsafe = cherryPick<any>;

/**
 * Removes `null`, `undefined`, and empty string (`""`) values from an object.
 *
 * By default, only top-level keys are cleansed. If `deepClean` is `true`,
 * nested **objects** are also recursively cleansed. Arrays are preserved as-is.
 *
 * Note: Non-plain objects (e.g., class instances, Date, Map, Set) are treated
 * like plain objects and may lose prototype information in the returned value.
 *
 * Examples:
 * ```ts
 * cleanseNullish({ a: 1, b: null, c: "", d: undefined });
 * // { a: 1 }
 *
 * cleanseNullish({ a: { b: null, c: 2 } }, true);
 * // { a: { c: 2 } }
 *
 * // Arrays are preserved; elements are not inspected/modified:
 * cleanseNullish({ a: [1, null, ""] }, true);
 * // { a: [1, null, ""] }
 * ```
 *
 * @param {Record<string, unknown> | null | undefined} object - The object to cleanse.
 * @param {boolean} [deepClean=false] - Whether to recursively cleanse nested objects.
 * @returns {Record<string, unknown> | null | undefined} A new object with nullish values removed.
 */
export const cleanseNullish = (
  object: Record<string, unknown> | null | undefined,
  deepClean = false
): Record<string, unknown> | null | undefined => {
  if (!object) return object;

  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(object)) {
    if (value === null || value === undefined || value === "") continue; // Skip nullish and empty string

    if (
      deepClean &&
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value)
    ) {
      // Recurse only into plain objects (not arrays)
      result[key] = cleanseNullish(
        value as Record<string, unknown>,
        true
      ) as Record<string, unknown>;
    } else {
      result[key] = value;
    }
  }

  return result;
};

/**
 * Recursively removes `null`, `undefined`, and empty string (`""`) values from an object.
 *
 * Equivalent to calling {@link cleanseNullish} with `deepClean = true`.
 *
 * @param {Record<string, unknown> | null | undefined} object - The object to deeply cleanse.
 * @returns {Record<string, unknown> | null | undefined} A new object with nullish values removed recursively.
 */
export const cleanseNullishDeep = (
  object: Record<string, unknown> | null | undefined
): Record<string, unknown> | null | undefined => cleanseNullish(object, true);

/**
 * Trims leading and trailing whitespace from a string.
 *
 * Examples:
 * ```ts
 * trimWhiteSpace("  hello  "); // "hello"
 * ```
 *
 * @param {unknown} value - The value to process.
 * @returns {string | unknown} A trimmed string if input was a string, otherwise the original value.
 */
export function trimWhiteSpace<T>(value: T): T extends string ? string : T {
  return (typeof value === "string" ? value.trim() : value) as any;
}

/**
 * Returns a Promise that resolves after a specified number of milliseconds.
 *
 * Examples:
 * ```ts
 * await delay(1000); // waits ~1 second
 * ```
 *
 * @param {number} ms - The number of milliseconds to wait before resolving.
 * @returns {Promise<void>} A promise that resolves after the delay.
 */
export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Recursively flattens a nested object into a single-level object
 * with dot-separated keys representing the original nesting.
 *
 * Arrays are not flattened, only plain objects are traversed.
 *
 * Examples:
 * ```ts
 * flattenObjectDeep({ a: { b: { c: 1 } }, d: 2 });
 * // => { "a.b.c": 1, "d": 2 }
 *
 * flattenObjectDeep({ user: { name: "Alice", info: { age: 30 } } });
 * // => { "user.name": "Alice", "user.info.age": 30 }
 * ```
 *
 * @param {Record<string, any>} obj - The object to flatten.
 * @param {string} [trail=""] - Used internally to build nested key paths.
 * @param {Record<string, any>} [result={}] - Used internally to accumulate results.
 * @returns {Record<string, any>} A new object with flattened keys.
 */
export const flattenObjectDeep = (
  obj: Record<string, any>,
  trail = "",
  result: Record<string, any> = {}
): Record<string, any> => {
  for (const [key, value] of Object.entries(obj)) {
    const newKey = trail ? `${trail}.${key}` : key;
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      !(value instanceof Date)
    ) {
      flattenObjectDeep(value, newKey, result);
    } else {
      result[newKey] = value;
    }
  }
  return result;
};

/**
 * Splits a flattened key (dot-separated path) into an array of path segments.
 *
 * Useful for working with keys generated by {@link flattenObjectDeep}.
 *
 * @param {string} key - The flattened key string (e.g., "a.b.c").
 * @returns {string[]} An array of path segments.
 */
export const getPathFromFlattenedKey = (key: string): string[] =>
  key.split(".");
