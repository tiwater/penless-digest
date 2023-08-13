# Penless Digest

A Chrome extension help to digest the content of current web page, powered by GPT-4 via Penless Agent Platform.

## Development

```bash
pnpm install
pnpm watch
```

Go to the Extension page in Chrome, enable Developer mode, and load the `build` folder as unpacked extension.

**Note**: The command `pnpm watch` monitors code changes and triggers build automatically, however you still need to reload the extension in Chrome every time the code changes.

## Build

```bash
pnpm install
pnpm build
```

**Note**: The publishing process of Chrome Extension is not our focus, please refer to the official documents for more information.

## Readings 

* https://hackernoon.com/how-to-create-a-chrome-extension-with-react