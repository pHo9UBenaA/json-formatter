/**
 * @file content.ts
 * @description Content script for JSON formatter Chrome extension
 * @created by Cline
 */

/**
 * Default checked state for the pretty-print checkbox
 */
const defaultChecked = true;

/**
 * Ensures a valid document object is available
 *
 * Uses the provided document or falls back to global document in browser context.
 *
 * @param doc - Optional document object to validate
 * @returns The validated document object
 */
function ensureDocument(doc?: Document): Document {
  if (!doc && typeof document !== "undefined") {
    return document;
  }

  if (!doc) {
    throw new Error("JSON formatter: Document object is required");
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
 * Creates the formatter container with control panel
 *
 * Adds a container with pretty-print toggle checkbox above the JSON content.
 *
 * @param doc - Document to add elements to
 */
function createFormatterContainer(doc: Document): HTMLDivElement {
  // Create container
  const container = doc.createElement("div");
  container.className = "ext-json-formatter-container";

  // Create control panel
  const controlPanel = doc.createElement("div");
  controlPanel.className = "ext-json-formatter-controls";

  // Create label
  const label = doc.createElement("label");
  label.textContent = "Pretty-print";
  label.htmlFor = "json-pretty-print-toggle";
  label.className = "ext-json-formatter-label";

  // Create checkbox (checked by default)
  const checkbox = doc.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = "json-pretty-print-toggle";
  checkbox.className = "ext-json-formatter-checkbox";
  checkbox.checked = defaultChecked;

  // Add event listener to toggle formatting
  checkbox.addEventListener("change", () => {
    // Use the existing function with the checkbox state
    applyFormattedJsonToPreElement(doc, checkbox.checked);
  });

  // Assemble control panel
  controlPanel.appendChild(label);
  controlPanel.appendChild(checkbox);
  container.appendChild(controlPanel);

  return container;
}

/**
 * Appends the formatter container to the document
 *
 * @param doc - Document to append to
 */
function appendFormatterContainer(doc: Document): void {
  const container = createFormatterContainer(doc);

  // Insert container in the body
  doc.body.appendChild(container);
}

/**
 * Applies JSON formatting to an pre element
 *
 * @param doc - Document to search within
 * @param prettyPrint - Whether to format with indentation
 */
function applyFormattedJsonToPreElement(
  doc: Document,
  prettyPrint: boolean = true,
): void {
  const preElement = doc.querySelector("pre");
  if (!preElement) {
    throw new Error("JSON formatter: No pre element found");
  }

  const jsonContent = preElement.textContent;
  if (!jsonContent) {
    throw new Error("JSON formatter: Empty pre element");
  }

  const parsedJson = JSON.parse(jsonContent);
  const formattedJson = prettyPrint
    ? JSON.stringify(parsedJson, null, 2)
    : JSON.stringify(parsedJson);

  preElement.textContent = formattedJson;
}

export function main(doc?: Document): void {
  try {
    const document = ensureDocument(doc);

    removeExistingFormatter(document);
    appendFormatterContainer(document);

    applyFormattedJsonToPreElement(document, defaultChecked);
  } catch (error) {
    console.error("JSON formatter: Unexpected error", error);
  }
}

if (typeof document !== "undefined") {
  main();
}
