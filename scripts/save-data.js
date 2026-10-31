const KEY = "escape-exe-save-v1";
export function freshSave() {
  return {
    version: 1,
    gems: 200,
    completed: { sql: [], python: [], java: [] },
    owned: { byte: 1, patch: 1, query: 1, echo: 1 },
    party: ["byte", "patch", "query", "echo"],
    drafts: {},
    paused: false,
  };
}
export function loadSave(storage) {
  const clean = freshSave();
  try {
    const data = JSON.parse(storage.getItem(KEY));
    if (!data || data.version !== 1) return clean;
    if (
      Number.isSafeInteger(data.gems) &&
      data.gems >= 0 &&
      data.gems <= 100000
    )
      clean.gems = data.gems;
    for (const world of ["sql", "python", "java"])
      if (Array.isArray(data.completed?.[world]))
        clean.completed[world] = [
          ...new Set(
            data.completed[world].filter(
              (n) => Number.isInteger(n) && n >= 0 && n < 4,
            ),
          ),
        ];
    const ids = [
      "byte",
      "patch",
      "query",
      "echo",
      "fern",
      "bolt",
      "pip",
      "rune",
      "nova",
      "atlas",
      "zero",
      "sol",
    ];
    for (const id of ids)
      if (Number.isSafeInteger(data.owned?.[id]) && data.owned[id] > 0)
        clean.owned[id] = Math.min(data.owned[id], 10000);
    if (Array.isArray(data.party)) {
      const party = [
        ...new Set(
          data.party.filter((id) => ids.includes(id) && clean.owned[id]),
        ),
      ];
      if (party.length === 4) clean.party = party;
    }
    if (data.drafts && typeof data.drafts === "object")
      for (const [key, value] of Object.entries(data.drafts))
        if (
          /^(sql|python|java)-[0-3]-[01]$/.test(key) &&
          typeof value === "string"
        )
          clean.drafts[key] = value.slice(0, 4000);
    clean.paused = data.paused === true;
  } catch {}
  return clean;
}
export function writeSave(storage, state) {
  try {
    storage.setItem(KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}
export function rewardClear(state, world, index) {
  if (state.completed[world].includes(index)) return 0;
  state.completed[world].push(index);
  const amount = index === 3 ? 60 : 35;
  state.gems += amount;
  return amount;
}
export function rollCharacter(characters, random = Math.random) {
  const value = random();
  const rarity =
    value < 0.55
      ? "Common"
      : value < 0.85
        ? "Rare"
        : value < 0.97
          ? "Epic"
          : "Legendary";
  const pool = characters.filter((unit) => unit.rarity === rarity);
  return pool[Math.floor(random() * pool.length)];
}
