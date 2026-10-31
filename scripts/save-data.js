import { ASCENSION_COSTS, spentDuplicates } from "./combat.js";
const KEY = "escape-exe-save-v1";
export function freshSave() {
  return {
    version: 4,
    shards: 200,
    completed: { sql: [], python: [], java: [] },
    owned: { byte: 1 },
    party: ["byte"],
    drafts: {},
    paused: false,
    ascensions: {},
    storyRecruits: [],
  };
}
export function loadSave(storage) {
  const clean = freshSave();
  try {
    const data = JSON.parse(storage.getItem(KEY));
    if (!data || ![1, 2, 3, 4].includes(data.version)) return clean;
    const balance = data.version === 1 ? data.gems : data.shards;
    if (Number.isSafeInteger(balance) && balance >= 0 && balance <= 100000)
      clean.shards = balance;
    for (const world of ["sql", "python", "java"])
      if (Array.isArray(data.completed?.[world]))
        clean.completed[world] = [
          ...new Set(
            data.completed[world].filter(
              (n) => Number.isInteger(n) && n >= 0 && n < 16,
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
    if (data.version >= 3)
      for (const id of ids) {
        const stars = data.ascensions?.[id];
        if (
          Number.isInteger(stars) &&
          stars >= 0 &&
          stars <= 3 &&
          (clean.owned[id] || 0) - 1 >= spentDuplicates(stars)
        )
          clean.ascensions[id] = stars;
      }
    if (Array.isArray(data.party)) {
      const party = [
        ...new Set(
          data.party.filter((id) => ids.includes(id) && clean.owned[id]),
        ),
      ];
      if (party.length >= 1 && party.length <= 4) clean.party = party;
    }
    if (data.drafts && typeof data.drafts === "object")
      for (const [key, value] of Object.entries(data.drafts))
        if (
          /^(sql|python|java)-(?:[0-9]|1[0-5])-[0-3]$/.test(key) &&
          typeof value === "string"
        )
          clean.drafts[key] = value.slice(0, 12000);
    clean.paused = data.paused === true;
    if (data.version === 4 && Array.isArray(data.storyRecruits))
      clean.storyRecruits = [
        ...new Set(
          data.storyRecruits.filter(
            (id) =>
              STORY_RECRUITS.some((recruit) => recruit.id === id) &&
              clean.owned[id],
          ),
        ),
      ];
    recruitStoryCompanions(clean);
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
  const amount = index % 4 === 3 ? 60 : 35;
  state.shards += amount;
  recruitStoryCompanions(state);
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

export const SUMMON_COST = 100;
// A summon is committed once, before the cosmetic reveal starts.
export function summonCharacter(
  state,
  characters,
  random = Math.random,
  testing = false,
) {
  if (
    !testing &&
    (!Number.isSafeInteger(state.shards) || state.shards < SUMMON_COST)
  )
    return {
      ok: false,
      message: "Recover more Core Shards by clearing new stages.",
    };
  const unit = rollCharacter(characters, random);
  const duplicate = Boolean(state.owned[unit.id]);
  if (!testing) state.shards -= SUMMON_COST;
  state.owned[unit.id] = (state.owned[unit.id] || 0) + 1;
  return { ok: true, unit, duplicate, copies: state.owned[unit.id] };
}
export function replacePartyMember(state, slot, characterId) {
  if (
    !Number.isInteger(slot) ||
    slot < 0 ||
    slot >= 4 ||
    slot >= state.party.length
  )
    return { ok: false, message: "Choose one of the four party slots first." };
  if (!state.owned[characterId])
    return {
      ok: false,
      message: "Reconstruct this companion before adding them.",
    };
  if (state.party.includes(characterId))
    return { ok: false, message: "That companion is already in your party." };
  state.party[slot] = characterId;
  return { ok: true };
}

// Check the entire price before rolling so a five-pull cannot partially spend a wallet.
export function summonBatch(
  state,
  characters,
  count = 5,
  random = Math.random,
  testing = false,
) {
  if (![1, 5].includes(count))
    return { ok: false, message: "Choose a single or five-pull summon." };
  const cost = SUMMON_COST * count;
  if (!testing && (!Number.isSafeInteger(state.shards) || state.shards < cost))
    return {
      ok: false,
      message: `You need ${cost} Core Shards for this summon.`,
    };
  const results = Array.from({ length: count }, () =>
    summonCharacter(state, characters, random, testing),
  );
  return { ok: true, results };
}

export function availableDuplicates(state, id) {
  return Math.max(
    0,
    (state.owned[id] || 0) - 1 - spentDuplicates(state.ascensions[id] || 0),
  );
}
export function ascendCharacter(state, id) {
  if (!Object.hasOwn(state.owned, id))
    return { ok: false, message: "Summon this companion first." };
  const stars = state.ascensions[id] || 0;
  if (stars >= 3) return { ok: false, message: "Maximum ascension: 3 stars." };
  const cost = ASCENSION_COSTS[stars];
  if (availableDuplicates(state, id) < cost)
    return {
      ok: false,
      message: `You need ${cost} spare duplicates for the next star.`,
    };
  state.ascensions[id] = stars + 1;
  return { ok: true, stars: stars + 1, cost };
}

export const STORY_RECRUITS = [
  {
    id: "patch",
    name: "Patch",
    stage: 2,
    intro: "Your signal is stable. Let me keep it that way.",
  },
  {
    id: "echo",
    name: "Echo",
    stage: 3,
    intro: "One signal is a whisper. Together, we can break the static.",
  },
  {
    id: "pip",
    name: "Pip",
    stage: 4,
    intro: "Delivery for the resistance. Let's get this party connected.",
  },
];
export function recruitStoryCompanions(state) {
  // The furthest independently unlocked stage determines shared story recruitment.
  let reachedStage = 1;
  for (const world of ["sql", "python", "java"]) {
    let cleared = 0;
    while (cleared < 4 && state.completed[world].includes(cleared)) cleared++;
    reachedStage = Math.max(reachedStage, Math.min(4, cleared + 1));
  }
  state.storyRecruits ??= [];
  const joined = [];
  for (const recruit of STORY_RECRUITS) {
    if (
      reachedStage < recruit.stage ||
      state.storyRecruits.includes(recruit.id)
    )
      continue;
    state.owned[recruit.id] ||= 1; // An already-summoned hero is not a free duplicate farm.
    if (state.party.length < 4 && !state.party.includes(recruit.id))
      state.party.push(recruit.id);
    state.storyRecruits.push(recruit.id);
    joined.push(recruit);
  }
  // If the new recruit was already equipped from a summon, fill the unlocked
  // space with another guaranteed starter rather than leaving a permanent gap.
  const guaranteed = [
    "byte",
    ...STORY_RECRUITS.filter((recruit) => recruit.stage <= reachedStage).map(
      (recruit) => recruit.id,
    ),
  ];
  for (const id of guaranteed) {
    if (state.party.length >= reachedStage) break;
    if (state.owned[id] && !state.party.includes(id)) state.party.push(id);
  }
  return joined;
}
