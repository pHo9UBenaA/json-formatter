# JSON Formatter Chrome Extension

> [!WARNING]\
> このドキュメントと拡張機能は "Cline" によって生成されました。

A Chrome extension that automatically formats JSON files for better readability.

## Features

- Automatically formats JSON content when viewing JSON files in the browser
- Removes any existing formatter container with class "json-formatter-container"
- Applies proper indentation (2 spaces) to make JSON more readable
- Works on any URL ending with ".json"

## Development

This extension is built using Deno and TypeScript.

### Prerequisites

- Deno 1.x or higher
- Chrome browser

### Build Instructions

1. Clone this repository
2. Run `deno task build` to build the extension
3. Run `deno task zip` to create a distributable zip file
4. Load the extension in Chrome:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `dist` directory

### Testing

Run the tests with:

```
deno test src/tests/content.test.ts
```

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE)
file for details.
