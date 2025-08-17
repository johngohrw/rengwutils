/**
 * Restricts a number to be within the specified range.
 *
 * If the number is less than `min`, `min` is returned.
 * If the number is greater than `max`, `max` is returned.
 * Otherwise, the number itself is returned.
 *
 * Examples:
 * ```ts
 * clamp(5, 1, 10);   // 5
 * clamp(-5, 0, 10);  // 0
 * clamp(15, 0, 10);  // 10
 * ```
 *
 * @param {number} n - The number to clamp.
 * @param {number} min - The lower bound of the range.
 * @param {number} max - The upper bound of the range.
 * @returns {number} The clamped value.
 */
export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}
