# QVAC Baby Name Style Finder

Enter a style preference (e.g. "classic", "nature-inspired") and an optional origin, and an on-device AI suggests real baby name ideas that match, each with a one-line meaning note. Meanings are AI-generated approximations for inspiration — always double-check a name's meaning and origin with a dedicated baby-name reference before using it. No cloud call, no API key.

## Run

```bash
npm install
npm start
```

Then open http://localhost:31008

## QVAC SDK version

`@qvac/sdk` ^0.19.0 (see `package.json`).

## How it works

Built on [Tether's QVAC SDK](https://www.npmjs.com/package/@qvac/sdk) — all inference runs on-device, no cloud call, no API key. The app loads `LLAMA_3_2_1B_INST_Q4_0` locally with `loadModel()`, generates with `completion()` (streamed via `tokenStream`), and releases the model with `unloadModel()` on shutdown.

## License

MIT
