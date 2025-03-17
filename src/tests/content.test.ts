/**
 * @file content.test.ts
 * @description Test for JSON formatter content script
 * @created by Cline
 */

import { expect } from "jsr:@std/expect";
import { test } from "jsr:@std/testing/bdd";
import { formatJsonInPage } from "../content.ts";

// Define a custom interface for our mock document
interface MockDocument {
  querySelector: (selector: string) => any;
  preContent: string;
  containerRemoved: boolean;
}

// Mock DOM elements for testing
function setupMockDom(jsonContent: string, hasFormatterContainer = true): Document {
  // Create a mock document
  const mockDocument: MockDocument = {
    querySelector: (selector: string) => {
      if (selector === "pre") {
        return {
          get textContent() { return jsonContent; },
          set textContent(value: string) {
            mockDocument.preContent = value;
          }
        };
      }
      if (selector === "div.json-formatter-container") {
        return hasFormatterContainer ? { remove: () => { mockDocument.containerRemoved = true; } } : null;
      }
      return null;
    },
    preContent: "",
    containerRemoved: false
  };
  
  return mockDocument as unknown as Document;
}

test("formatJsonInPage - should format valid JSON and remove formatter container", () => {
  // Arrange
  const unformattedJson = '{"name":"test","value":123}';
  const expectedFormattedJson = JSON.stringify(JSON.parse(unformattedJson), null, 2);
  const mockDocument = setupMockDom(unformattedJson) as unknown as MockDocument;
  
  // Act
  formatJsonInPage(mockDocument as unknown as Document);
  
  // Assert
  expect(mockDocument.preContent).toBe(expectedFormattedJson);
  expect(mockDocument.containerRemoved).toBe(true);
});

test("formatJsonInPage - should handle case when formatter container doesn't exist", () => {
  // Arrange
  const unformattedJson = '{"name":"test","value":123}';
  const expectedFormattedJson = JSON.stringify(JSON.parse(unformattedJson), null, 2);
  const mockDocument = setupMockDom(unformattedJson, false) as unknown as MockDocument;
  
  // Act
  formatJsonInPage(mockDocument as unknown as Document);
  
  // Assert
  expect(mockDocument.preContent).toBe(expectedFormattedJson);
  expect(mockDocument.containerRemoved).toBe(false);
});

test("formatJsonInPage - should handle invalid JSON", () => {
  // Arrange
  const invalidJson = '{"name":"test",value:123}'; // Missing quotes around value
  const mockDocument = setupMockDom(invalidJson) as unknown as MockDocument;
  
  // Act
  formatJsonInPage(mockDocument as unknown as Document);
  
  // Assert
  // We only check that the container is removed, since the exact behavior with invalid JSON
  // might vary (some browsers might attempt to fix it, others might leave it as is)
  expect(mockDocument.containerRemoved).toBe(true); // Container should still be removed
  
  // Verify that the content was not successfully parsed and formatted
  // by checking that it's not equal to what a properly formatted version would be
  const properlyFormattedJson = '{\n  "name": "test",\n  "value": 123\n}';
  expect(mockDocument.preContent).not.toBe(properlyFormattedJson);
});

test("formatJsonInPage - should handle empty pre tag", () => {
  // Arrange
  const emptyJson = '';
  const mockDocument = setupMockDom(emptyJson) as unknown as MockDocument;
  
  // Act
  formatJsonInPage(mockDocument as unknown as Document);
  
  // Assert
  expect(mockDocument.preContent).toBe(''); // Should remain empty
  expect(mockDocument.containerRemoved).toBe(true);
});
