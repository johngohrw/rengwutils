/**
 * Copies the given text string to the user's clipboard.
 *
 * Relies on the [Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API).
 *
 * Examples:
 * ```ts
 * await copyToClipboard("Hello, world!");
 * console.log("Copied!");
 * ```
 *
 * @param {string} text - The text to copy to the clipboard.
 * @returns {Promise<void>} A promise that resolves once the text has been copied.
 */
export const copyToClipboard = (text: string) => {
  return navigator.clipboard.writeText(text);
};
