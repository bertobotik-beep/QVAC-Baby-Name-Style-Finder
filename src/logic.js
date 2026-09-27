// QVAC Baby Name Style Finder — core logic.
// completion() suggests real baby names matching a style (+ optional origin),
// each with a one-line meaning note. The small on-device model can get name
// meanings wrong, so the UI carries a clear disclaimer that these are
// AI-generated approximations, not verified etymology.

import { completion } from "@qvac/sdk";

function looksUnusable(text) {
  if (!text || text.trim().length === 0) return true;
  const bad = ["i cannot", "i can't", "as an ai", "i'm not able", "i am not able"];
  const lower = text.toLowerCase();
  return bad.some((phrase) => lower.includes(phrase));
}

// Parses "Name — meaning" or "Name: meaning" or "Name - meaning" lines.
function parseNameLines(raw) {
  return raw
    .split("\n")
    .map((line) => line.trim().replace(/^[-*\d.)\s]+/, ""))
    .filter((line) => line.length > 0)
    .map((line) => {
      // Allow accented letters (e.g. Oisín, Siân) in addition to plain A-Z.
      const match = line.match(/^([A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ'\-]*)\s*[—:\-–]\s*(.+)$/);
      if (match) {
        // Drop any trailing parenthetical restatement — the model sometimes
        // appends a second, conflicting meaning or a mismatched origin note
        // there, so only the first clean clause is kept.
        let meaning = match[2].split("(")[0].trim().replace(/\.$/, "").replace(/[,;]$/, "");
        if (!meaning) meaning = match[2].trim().replace(/\.$/, "");
        return { name: match[1].trim(), meaning };
      }
      const firstWord = line.split(/\s+/)[0].replace(/[^A-Za-zÀ-ÖØ-öø-ÿ'\-]/g, "");
      return firstWord ? { name: firstWord, meaning: "a name with its own story" } : null;
    })
    .filter(Boolean)
    .filter((entry) => entry.name.length > 1);
}

function fallbackNames(style) {
  const base = [
    { name: "Adrian", meaning: "from the sea / dark one" },
    { name: "Wren", meaning: "a small songbird" },
    { name: "Elena", meaning: "shining light" },
    { name: "Rowan", meaning: "little redhead / rowan tree" },
    { name: "Julian", meaning: "youthful, from the sky father" },
  ];
  return base;
}

export async function generateBabyNames(modelId, style, origin) {
  const originText = origin ? ` with a ${origin} origin` : "";
  const run = completion({
    modelId,
    history: [
      {
        role: "system",
        content:
          "You suggest real, actually-used baby names that match a requested style. If an " +
          "origin is given, EVERY suggested name must genuinely come from that origin — never " +
          "include a name from a different origin, and never mention a different origin in the " +
          "meaning note. For each name give exactly ONE short, clear meaning phrase — never " +
          "give two conflicting meanings for the same name. Reply with ONLY a plain list, one " +
          "name per line, in the exact format 'Name — meaning', no numbering, no commentary. " +
          "Suggest 5 names.",
      },
      { role: "user", content: "Style: nature-inspired" },
      {
        role: "assistant",
        content:
          "Wren — a small songbird\n" +
          "Hazel — the hazel tree, known for wisdom\n" +
          "River — flowing water\n" +
          "Fern — a green woodland plant\n" +
          "Sage — the herb, associated with wisdom",
      },
      { role: "user", content: "Style: nature-inspired with a Irish origin" },
      {
        role: "assistant",
        content:
          "Cian — ancient one\n" +
          "Fiona — fair or white\n" +
          "Aidan — little fire\n" +
          "Sorcha — brightness\n" +
          "Rory — red king",
      },
      { role: "user", content: `Style: ${style}${originText}` },
    ],
    stream: true,
    completionOpts: { temperature: 0.7, maxTokens: 220 },
  });

  let raw = "";
  for await (const token of run.tokenStream) raw += token;

  let names = looksUnusable(raw) ? [] : parseNameLines(raw);
  names = names.filter((n, i, arr) => arr.findIndex((x) => x.name.toLowerCase() === n.name.toLowerCase()) === i);

  if (names.length < 3) {
    names = names.concat(fallbackNames(style).filter((f) => !names.some((n) => n.name === f.name)));
  }
  names = names.slice(0, 6);

  return { style, origin, names };
}
