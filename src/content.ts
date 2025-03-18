/**
 * @file content.ts
 * @description Content script for JSON formatter Chrome extension
 * @created by Cline
 */

/**
 * Ensures a valid document object is available
 *
 * Uses the provided document or falls back to global document in browser context.
 *
 * @param doc - Optional document object to validate
 * @returns The validated document object or null if unavailable
 */
function ensureDocument(doc?: Document): Document | null {
  if (!doc && typeof document !== "undefined") {
    return document;
  }

  if (!doc) {
    console.error("JSON formatter: Document object is required");
    return null;
  }

  return doc;
}

/**
 * Removes any existing formatter containers from the document
 *
 * This ensures idempotence when the formatter runs multiple times.
 *
 * @param doc - Document object to clean
 */
function removeExistingFormatter(doc: Document): void {
  const formatterContainer = doc.querySelector(
    "div.json-formatter-container",
  );

  if (formatterContainer) {
    formatterContainer.remove();
  }
}

/**
 * Locates the pre element containing JSON content
 *
 * @param doc - Document to search within
 * @returns The pre element or null if not found
 */
function findJsonPreElement(doc: Document): HTMLPreElement | null {
  const preElement = doc.querySelector("pre");

  if (!preElement) {
    console.warn("JSON formatter: No pre element found");
    return null;
  }

  return preElement;
}

/**
 * Extracts JSON content from a pre element
 *
 * @param preElement - HTML pre element containing JSON
 * @returns The JSON content as a string, or null if empty
 */
function extractJsonContent(preElement: HTMLPreElement): string | null {
  const jsonContent = preElement.textContent || "";

  if (!jsonContent.trim()) {
    console.warn("JSON formatter: Empty pre element");
    return null;
  }

  return jsonContent;
}

/**
 * Formats JSON string and applies it to the provided element
 *
 * Parses and re-stringifies JSON with proper indentation.
 * If parsing fails, the original content is preserved.
 *
 * @param element - The pre element to update
 * @param jsonContent - Raw JSON string to format
 */
function applyFormattedJsonToElement(
  element: HTMLPreElement,
  jsonContent: string,
): void {
  const parsedJson = JSON.parse(jsonContent);
  const formattedJson = JSON.stringify(parsedJson, null, 2);
  element.textContent = formattedJson;
}

/**
 * Formats JSON content in the current page
 *
 * 1. Removing div.json-formatter-container if it exists
 * 2. Finding pre tag and formatting its JSON content
 *
 * @param doc - Document object to operate on
 */
export function formatJsonInPage(doc?: Document): void {
  const document = ensureDocument(doc);
  if (!document) return;

  try {
    removeExistingFormatter(document);

    const preElement = findJsonPreElement(document);
    if (!preElement) return;

    const jsonContent = extractJsonContent(preElement);
    if (!jsonContent) return;

    applyFormattedJsonToElement(preElement, jsonContent);
  } catch (error) {
    console.error("JSON formatter: Unexpected error", error);
  }
}

// Execute the formatter when the content script runs, but only in browser environment
if (typeof document !== "undefined") {
  formatJsonInPage();
}
