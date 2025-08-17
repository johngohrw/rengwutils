/**
 * Creates an array of numbers progressing from `start` up to, but not including, `end`.
 *
 * Examples:
 * ```ts
 * range(0, 5) // [0, 1, 2, 3, 4]
 * range(2, 6) // [2, 3, 4, 5]
 * range(5, 5) // []
 * ```
 *
 * @param {number} [start=0] - The starting number of the sequence.
 * @param {number} end - The end number (exclusive).
 * @returns {number[]} An array of numbers from `start` to `end - 1`.
 */
export function range(start = 0, end: number) {
  return Array.from(new Array(end - start), (_, i) => i + start);
}
