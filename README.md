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

`src/logic.js` sends two one-shot example conversations in the `completion()` history — one style-only ("nature-inspired") and one style-plus-origin ("nature-inspired with an Irish origin") — so the small 1B model reliably keeps every name faithful to the requested origin instead of mixing origins. `parseNameLines()` accepts accented characters (e.g. Oisín, Siân) and several "Name — meaning" separator styles, and drops any trailing parenthetical the model sometimes appends as a second, conflicting meaning.

## Example

- **Style:** `nature-inspired`, **Origin:** `Irish`
- **Names returned:** something like `Cian — ancient one`, `Fiona — fair or white`, `Aidan — little fire`, `Sorcha — brightness`, `Rory — red king`. Meanings are AI-generated approximations — always verify a name's real meaning and origin before using it.

## Setup

Requires Node.js and a machine that can run the QVAC on-device runtime (see the QVAC SDK docs for platform support). `npm install` pulls in `@qvac/sdk`; `npm start` loads the `LLAMA_3_2_1B_INST_Q4_0` model on first run, which can take a moment.

## License

MIT
