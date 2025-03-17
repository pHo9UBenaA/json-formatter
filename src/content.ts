/**
 * @file content.ts
 * @description Content script for JSON formatter Chrome extension
 * @created by Cline
 */

/**
 * Formats JSON in the page by:
 * 1. Removing div.json-formatter-container if it exists
 * 2. Finding pre tag and formatting its JSON content
 * 
 * @param doc Document object to operate on
 */
function formatJsonInPage(doc?: Document): void {
  // In browser environment, use global document if not provided
  // In test environment, doc must be provided
  if (!doc && typeof document !== 'undefined') {
    doc = document;
  }
  
  if (!doc) {
    console.error('JSON formatter: Document object is required');
    return;
  }

  try {
    // Remove existing formatter container if present
    const formatterContainer = doc.querySelector('div.json-formatter-container');
    if (formatterContainer) {
      formatterContainer.remove();
    }
    
    // Find pre tag containing JSON
    const preElement = doc.querySelector('pre');
    if (!preElement) {
      console.warn('JSON formatter: No pre element found');
      return;
    }
    
    const jsonContent = preElement.textContent || '';
    if (!jsonContent.trim()) {
      console.warn('JSON formatter: Empty pre element');
      return;
    }
    
    try {
      // Parse and re-stringify to format
      const parsedJson = JSON.parse(jsonContent);
      const formattedJson = JSON.stringify(parsedJson, null, 2);
      
      // Update pre element with formatted JSON
      preElement.textContent = formattedJson;
      console.log('JSON formatter: Successfully formatted JSON');
    } catch (error) {
      console.error('JSON formatter: Failed to parse JSON', error);
      // Leave content unchanged if parsing fails
    }
  } catch (error) {
    console.error('JSON formatter: Unexpected error', error);
  }
}

// Execute the formatter when the content script runs, but only in browser environment
if (typeof document !== 'undefined') {
  formatJsonInPage();
}
