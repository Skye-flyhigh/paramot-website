/**
 * Remove dangerous inputs and transform them into text (use for html integrations)
 * @param str any bit of text entered by user
 * @returns a clean string
 */
export function escapeHTML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
