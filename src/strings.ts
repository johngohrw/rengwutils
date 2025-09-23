/**
 * Capitalizes the first character of a string and returns the new string.
 *
 * Examples:
 * ```ts
 * capitalize("hello") // "Hello"
 * capitalize("world") // "World"
 * capitalize("") // ""
 * ```
 *
 * @param {string} string - The string to capitalize.
 * @returns {string} A new string with the first character converted to uppercase.
 */
export function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/** Class name joiner
 *  filters away failed boolean checks
 */
export const cls = (...classes: (string | undefined | false)[]) => {
  return classes
    .filter((o) => {
      if (o === undefined) return false;
      if (o === false) return false;
      return true;
    })
    .join(" ");
};
