import { gradeBehavior } from "./behavior-grading.js";
import { skillBitCost, skillReady, BITS_PER_ATTACK } from "./skill-charge.js";
import { skillPrompt } from "./skill-prompts.js";
import {
  ASCENSION_COSTS,
  characterStats,
  createBattleParty,
  retaliate,
  resolveLessonTurn,
} from "./combat.js";
import { campaigns, characters, enemies } from "./campaigns.js";
import {
  loadSave,
  writeSave,
  rewardClear,
  summonBatch,
  replacePartyMember,
  SUMMON_COST,
  ascendCharacter,
  availableDuplicates,
  STORY_RECRUITS,
} from "./save-data.js";
import { drawLandscape, drawCharacter } from "./pixel-art.js";
const $ = (id) => document.getElementById(id);
let storage;
try {
  storage = localStorage;
} catch {
  storage = {
    getItem: () => null,
    setItem: () => {
      throw Error();
    },
  };
}
const state = loadSave(storage);
// Temporary testing build: random summons have an unlimited shard wallet by default.
// The earned-wallet URL is retained for economy regression checks.
const unlimitedShards =
  new URLSearchParams(location.search).get("shards") !== "earned";
let world = campaigns[0],
  stageIndex = 0,
  phase = 0,
  hintIndex = 0,
  won = false,
  busy = false,
  selectedSlot = null,
  flashUntil = 0;
let battleParty = [];
let partyDefeated = false;
let activeSkill = null;
let pendingRecruitNotice = "";
let advanceTimer = null;
let navigationVersion = 0;
function cancelAdvance() {
  clearTimeout(advanceTimer);
  advanceTimer = null;
  navigationVersion++;
}
function animateElement(node, frames, options) {
  if (state.paused || reducedMotion.matches) {
    document.getAnimations?.().forEach((animation) => animation.cancel());
    return;
  }
  if (!node.animate) return;
  node.animate(frames, options);
}
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
function save() {
  if (!writeSave(storage, state))
    $("combat-log").textContent =
      "Storage unavailable. Progress cannot be saved after this session.";
  $("shards").textContent = unlimitedShards ? "Unlimited" : state.shards;
}
function showPage(name) {
  if (busy) return;
  cancelAdvance();
  if (summonInProgress) revealSummon();
  document.body.dataset.page = name;
  document
    .querySelectorAll("main>section:not(.intro)")
    .forEach((section) => (section.hidden = section.id !== name));
  document.querySelector(".intro").hidden = name !== "worlds";
  document.querySelectorAll("nav [data-page]").forEach((button) => {
    if (button.dataset.page === name)
      button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
  if (name === "worlds") renderWorlds();
  if (name === "party") {
    selectedSlot = null;
    renderParty();
  }
  if (name === "reconstruction") renderSummoning();
  if (name === "journal") renderJournal();
  animateElement(
    $(name),
    [
      { opacity: 0, transform: "translateY(8px)" },
      { opacity: 1, transform: "translateY(0)" },
    ],
    { duration: 240, easing: "ease-out" },
  );
}
function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}
function renderWorlds() {
  const list = $("world-list");
  list.replaceChildren();
  campaigns.forEach((entry, index) => {
    const card = element("article", undefined, "world-card");
    card.style.setProperty("--accent", entry.color);
    const art = element("canvas", undefined, "world-art");
    art.width = 384;
    art.height = 220;
    art.setAttribute("role", "img");
    art.setAttribute("aria-label", entry.name + " pixel landscape");
    drawLandscape(art, entry.id);
    const body = element("div", undefined, "world-content");
    body.append(
      element(
        "div",
        `0${index + 1} / ${entry.language.toUpperCase()} / ${entry.core}`,
        "world-meta",
      ),
      element("h3", entry.name),
      element("p", entry.description),
    );
    const button = element(
      "button",
      (state.completed[entry.id].length ? "Continue journey" : "Enter world") +
        " >",
    );
    button.onclick = () => {
      const next = entry.stages.findIndex(
        (_, i) => !state.completed[entry.id].includes(i),
      );
      enterStage(entry, next < 0 ? entry.stages.length - 1 : next);
    };
    const progress = element("div", undefined, "world-progress");
    entry.stages.forEach((_, i) =>
      progress.append(
        element(
          "i",
          undefined,
          state.completed[entry.id].includes(i) ? "cleared" : "",
        ),
      ),
    );
    body.append(
      button,
      progress,
      element(
        "small",
        `${state.completed[entry.id].length} / ${entry.stages.length} STAGES RESTORED`,
      ),
    );
    card.append(art, body);
    list.append(card);
  });
}
function draftKey() {
  return `${world.id}-${stageIndex}-${phase}`;
}
function enterStage(entry, index) {
  if (busy) return;
  world = entry;
  stageIndex = index;
  phase = 0;
  hintIndex = 0;
  won = false;
  showPage("adventure");
  renderStage();
  $("stage-title").focus();
}
function currentExercise() {
  const exercises = world.stages[stageIndex].exercises;
  return exercises[Math.min(phase, exercises.length - 1)];
}
function renderExercise() {
  const exercise = currentExercise();
  $("objective").textContent = exercise.objective;
  $("lesson").textContent = exercise.lesson;
  $("example").textContent = exercise.example;
  $("worked-lesson").hidden = !exercise.workedExample;
  $("worked-example").textContent = exercise.workedExample || "";
  $("problem-details").textContent =
    `${exercise.constraints || "Use the shown inputs and produce the requested output."}\n${exercise.entry === "solve" ? "Contract: define solve with the shown parameters and return a value. Java methods are inside a supplied Solution class." : ""}`;
  $("exercise-progress").textContent =
    `Example ${phase + 1} / ${world.stages[stageIndex].exercises.length} | Turn budget: 20 basic / 40 attack spell / 40 utility`;
  $("code").value = state.drafts[draftKey()] ?? exercise.starter;
  $("cast").disabled = false;
}
function renderStage() {
  const stage = world.stages[stageIndex];
  $("world-label").textContent =
    `${world.language} / Chapter ${stage.chapter}: ${stage.chapterTitle} / ${stage.difficulty}`;
  $("stage-title").textContent = stage.title;
  $("stage-count").textContent = `${stageIndex + 1} / ${world.stages.length}`;
  $("language").textContent = world.language + " / PRACTICE";
  $("location").textContent = stage.enemy.name + " / " + world.core;
  renderExercise();
  $("runtime-note").textContent =
    world.id === "java"
      ? "Bounded Java teaching interpreter: int, boolean, String, arrays, loops and static methods. Not a JVM; imports, objects and advanced Java are not supported. Unsupported forms do not trigger enemy attacks."
      : world.id === "python"
        ? "Real Python in a browser worker. Beginner sandbox: functions, loops, built-ins and collections; imports/files/private attributes are restricted. No server receives your code."
        : "Real SQLite in a disposable browser worker. Run checks visible samples; Cast also checks transfer fixtures. Read-only queries only.";
  $("output").textContent =
    "Read the objective, try your code, then cast when ready.";
  $("combat-log").textContent =
    pendingRecruitNotice || "Your party is ready. Coding has no time limit.";
  pendingRecruitNotice = "";
  $("hp").max = stage.enemy.hp;
  $("hp").value = stage.enemy.hp;
  $("hp-text").textContent = `${stage.enemy.hp} / ${stage.enemy.hp}`;
  $("cast").disabled = false;
  $("code").readOnly = false;
  $("run").disabled = false;
  renderMap();
  battleParty = createBattleParty(state, characters);
  partyDefeated = false;
  $("retry-battle").hidden = true;
  renderBattleParty();
  drawFrame(0);
}
function renderBattleParty() {
  $("battle-party").replaceChildren();
  battleParty.forEach((unit) => {
    const block = element("div", undefined, "companion");
    block.dataset.unit = unit.id;
    block.classList.toggle("fallen", unit.hp === 0);
    const ready = skillReady(unit) && !won && !partyDefeated;
    block.classList.toggle("skill-ready", ready);
    const trigger = element("button", undefined, "skill-trigger");
    trigger.append(sprite(unit));
    trigger.disabled = !ready;
    trigger.setAttribute(
      "aria-label",
      `${unit.name}: ${unit.skill.name}. ${ready ? "Ready to use" : `${unit.bits}/${skillBitCost(unit)} bits`}`,
    );
    trigger.onclick = () => openSkill(unit.id);
    block.append(
      trigger,
      element("div", unit.name),
      element("small", unit.skill.name, "skill-name"),
      element(
        "small",
        `${unit.hp}/${unit.maxHp} HP${unit.shield ? " +" + unit.shield + " shield" : ""}`,
      ),
    );
    const health = element("progress");
    health.max = unit.maxHp;
    health.value = unit.hp;
    health.setAttribute("aria-label", `${unit.name} health`);
    block.append(health);
    const charge = element("progress", undefined, "skill-charge");
    charge.max = skillBitCost(unit);
    charge.value = unit.bits;
    charge.setAttribute("aria-label", `${unit.name} skill charge`);
    block.append(
      element(
        "small",
        ready
          ? "Skill ready · click icon"
          : `${unit.bits}/${skillBitCost(unit)} bits`,
        "charge-label",
      ),
      charge,
    );
    $("battle-party").append(block);
  });
  const enemy = world.stages[stageIndex].enemy;
  $("enemy-attack").textContent =
    enemy.type === "aoe"
      ? `AoE / ${enemy.attack} ATK / hits everyone on failed casts`
      : `Single / ${enemy.attack} ATK / targets a living tank first`;
}
function openSkill(id) {
  if (busy || won || partyDefeated) return;
  const unit = battleParty.find((ally) => ally.id === id);
  if (!unit || !skillReady(unit)) return;
  activeSkill = { id, prompt: skillPrompt(unit, world.id, stageIndex) };
  $("skill-title").textContent = `${unit.name} / ${unit.skill.name}`;
  $("skill-objective").textContent = activeSkill.prompt.objective;
  $("skill-example").textContent = activeSkill.prompt.example;
  $("skill-code").value = activeSkill.prompt.starter;
  $("skill-cost").textContent =
    `Cost: ${skillBitCost(unit) / 8} Bytes (${skillBitCost(unit)} bits). Auto-attacks earn ${BITS_PER_ATTACK} bits. This prompt does not advance the lesson.`;
  $("skill-runtime").textContent = $("runtime-note").textContent;
  $("skill-feedback").textContent =
    "Run code to practice safely. Use skill checks your answer and spends charge only on success; incorrect committed answers trigger an enemy attack.";
  $("skill-dialog").showModal();
  $("skill-code").focus();
}
function closeSkill() {
  $("skill-dialog").close();
  activeSkill = null;
}
async function checkSkill(commit) {
  if (busy || !activeSkill) return;
  const selected = activeSkill;
  busy = true;
  document.body.setAttribute("aria-busy", "true");
  for (const id of ["skill-run", "skill-use", "skill-hint", "close-skill"])
    $(id).disabled = true;
  $("skill-code").readOnly = true;
  $("skill-feedback").textContent = "Checking skill code...";
  renderMap();
  let result;
  try {
    result = await gradeBehavior(
      world.id,
      selected.prompt,
      $("skill-code").value,
      commit,
    );
  } catch (error) {
    result = {
      ok: false,
      kind: "unavailable",
      message: "Runtime unavailable: " + error.message,
    };
  } finally {
    busy = false;
    document.body.setAttribute("aria-busy", "false");
    for (const id of ["skill-run", "skill-use", "skill-hint", "close-skill"])
      $(id).disabled = false;
    $("skill-code").readOnly = false;
    renderMap();
  }
  $("skill-feedback").textContent = result.message;
  if (!commit) return;
  if (!result.ok) {
    if (!["unavailable", "unsupported"].includes(result.kind)) {
      closeSkill();
      await enemyRetaliation();
    }
    return;
  }
  const turn = resolveLessonTurn(
    battleParty,
    Number($("hp").value),
    world.stages[stageIndex].exercises.length - phase,
    selected.id,
  );
  if (!turn) {
    closeSkill();
    return;
  }
  const unit = battleParty.find((ally) => ally.id === selected.id);
  $("hp").value = turn.hp;
  $("hp-text").textContent =
    `${turn.hp} / ${world.stages[stageIndex].enemy.hp}`;
  closeSkill();
  renderBattleParty();
  drawFrame(0);
  $("combat-log").textContent = `${unit.name} used ${unit.skill.name}.`;
  $("code").focus();
}
$("close-skill").onclick = () => {
  if (!busy) closeSkill();
};
$("skill-dialog").addEventListener("cancel", (event) => {
  if (busy) event.preventDefault();
  else activeSkill = null;
});
$("skill-hint").onclick = () => {
  if (activeSkill) $("skill-feedback").textContent = activeSkill.prompt.hint;
};
$("skill-run").onclick = () => checkSkill(false);
$("skill-use").onclick = () => checkSkill(true);
async function enemyRetaliation() {
  setCodeFocus(false);
  busy = true;
  document.body.setAttribute("aria-busy", "true");
  $("cast").disabled = true;
  renderMap();
  const result = retaliate(battleParty, world.stages[stageIndex].enemy);
  renderBattleParty();
  $("combat-log").textContent =
    "Cast failed. Enemy attacks: " +
    result.hits
      .map(
        (hit) =>
          `${hit.name} -${hit.damage} HP${hit.absorbed ? " (" + hit.absorbed + " blocked by shield)" : ""}`,
      )
      .join(", ");
  for (const hit of result.hits)
    animateElement(
      document.querySelector(`[data-unit="${hit.id}"]`),
      [
        { transform: "translateX(-4px)", backgroundColor: "#73352d" },
        { transform: "translateX(4px)" },
        { transform: "translateX(0)", backgroundColor: "transparent" },
      ],
      { duration: 350 },
    );
  await new Promise((resolve) =>
    setTimeout(resolve, state.paused || reducedMotion.matches ? 50 : 450),
  );
  partyDefeated = result.defeated;
  busy = false;
  document.body.setAttribute("aria-busy", "false");
  $("cast").disabled = partyDefeated;
  if (partyDefeated) {
    $("retry-battle").hidden = false;
    $("combat-log").textContent +=
      ". Party down. Retry free to restore health; your draft, boss checkpoint and earned progress are kept.";
    $("retry-battle").focus();
  }
  renderMap();
}
function renderMap() {
  const map = $("stage-map");
  map.replaceChildren();
  const currentChapter = Math.floor(stageIndex / 4);
  $("chapter-map").replaceChildren();
  for (let chapter = 0; chapter < 4; chapter++) {
    const button = element("button", `Chapter ${chapter + 1}`);
    button.disabled =
      busy ||
      (chapter > 0 && !state.completed[world.id].includes(chapter * 4 - 1));
    if (chapter === currentChapter) button.setAttribute("aria-current", "step");
    button.onclick = () => {
      const start = chapter * 4;
      let next = start;
      while (next < start + 4 && state.completed[world.id].includes(next))
        next++;
      enterStage(world, Math.min(next, start + 3));
    };
    $("chapter-map").append(button);
  }
  world.stages.forEach((stage, index) => {
    if (Math.floor(index / 4) !== currentChapter) return;
    const button = element(
      "button",
      `${state.completed[world.id].includes(index) ? "Done / " : ""}${stage.isBoss ? "Boss " : "Stage "}${index + 1}`,
    );
    button.disabled =
      busy || (index > 0 && !state.completed[world.id].includes(index - 1));
    if (index === stageIndex) button.setAttribute("aria-current", "step");
    button.onclick = () => enterStage(world, index);
    map.append(button);
  });
}
function sprite(unit) {
  const art = element("canvas", undefined, "sprite");
  art.width = 48;
  art.height = 52;
  art.setAttribute("aria-hidden", "true");
  drawCharacter(art.getContext("2d"), 3, 0, unit.color);
  return art;
}
function renderParty() {
  const slots = $("party-slots");
  slots.replaceChildren();
  state.party.forEach((id, index) => {
    const unit = characters.find((character) => character.id === id);
    const button = element("button", undefined, "party-slot secondary");
    button.dataset.slot = index;
    button.setAttribute("aria-pressed", String(selectedSlot === index));
    button.append(
      sprite(unit),
      element("span", `Slot ${index + 1}: ${unit.name}`),
    );
    button.onclick = () => {
      selectedSlot = index;
      renderParty();
      $("party-message").textContent = characters.some(
        (character) =>
          state.owned[character.id] && !state.party.includes(character.id),
      )
        ? `Replacing ${unit.name}. Choose an owned reserve below.`
        : "No reserve companions yet. Roll a random companion in the Summon tab; duplicate copies cannot fill another slot.";
    };
    slots.append(button);
  });
  for (let index = state.party.length; index < 4; index++) {
    const recruit = STORY_RECRUITS[index - 1];
    const empty = element(
      "button",
      `${recruit.name} joins at Stage ${recruit.stage}`,
      "party-slot secondary locked-slot",
    );
    empty.disabled = true;
    empty.setAttribute(
      "aria-label",
      `Party slot ${index + 1} unlocks when ${recruit.name} joins at Stage ${recruit.stage}`,
    );
    slots.append(empty);
  }
  const list = $("roster");
  list.replaceChildren();
  characters.forEach((unit) => {
    const card = element("article", undefined, "unit-card");
    card.dataset.character = unit.id;
    const active = state.party.includes(unit.id);
    const owned = Boolean(state.owned[unit.id]);
    const button = element(
      "button",
      active
        ? "Already in party"
        : !owned
          ? "Not reconstructed"
          : selectedSlot === null
            ? "Select a party slot"
            : `Assign to slot ${selectedSlot + 1}`,
    );
    button.disabled = active || !owned || selectedSlot === null;
    button.onclick = () => {
      const result = replacePartyMember(state, selectedSlot, unit.id);
      if (result.ok) {
        const slot = selectedSlot;
        selectedSlot = null;
        save();
        renderParty();
        $("party-message").textContent =
          `${unit.name} is now in slot ${slot + 1}. Party saved.`;
        slots.querySelector(`[data-slot="${slot}"]`)?.focus();
      } else $("party-message").textContent = result.message;
    };
    const stars = state.ascensions[unit.id] || 0;
    const stats = characterStats(unit, stars);
    const duplicates = availableDuplicates(state, unit.id);
    const ascend = element(
      "button",
      stars === 3
        ? "Max ascension / 3 stars"
        : `Ascend / ${ASCENSION_COSTS[stars]} duplicates`,
      "secondary ascend-button",
    );
    ascend.dataset.ascend = unit.id;
    ascend.disabled =
      !owned || stars === 3 || duplicates < ASCENSION_COSTS[stars];
    ascend.onclick = () => {
      const outcome = ascendCharacter(state, unit.id);
      if (outcome.ok) {
        save();
        renderParty();
      }
      $("party-message").textContent = outcome.ok
        ? `${unit.name} ascended to ${outcome.stars} stars. HP, ATK and DEF increased!`
        : outcome.message;
    };
    card.append(
      sprite(unit),
      element("h3", unit.name),
      element(
        "p",
        `${unit.role} / ${unit.rarity} / ${owned ? "Copies: " + state.owned[unit.id] : "Signal missing"}`,
      ),
      element(
        "p",
        `${stars}/3 stars | HP ${stats.hp} | ATK ${stats.attack} | DEF ${stats.defense}`,
      ),
      element("p", `Spare duplicates: ${duplicates}`),
      element(
        "p",
        `${unit.skill.name}: ${unit.skill.description}`,
        "character-skill",
      ),
      element(
        "p",
        `Skill charge: ${skillBitCost(unit, stars)} bits (${skillBitCost(unit, stars) / 8} Bytes). Auto-attacks earn 8 bits. Each ascension star reduces the cost by 1 bit. Click a charged battle portrait and solve its prompt to activate.`,
      ),
      button,
      ascend,
    );
    list.append(card);
  });
}
let summonInProgress = false;
let summonCooldownUntil = 0;
let summonRevealTimer = null;
let lastSummon = null;
function renderSummoning() {
  $("summon").disabled =
    summonInProgress ||
    performance.now() < summonCooldownUntil ||
    (!unlimitedShards && state.shards < SUMMON_COST);
  $("summon").textContent = summonInProgress
    ? "Rolling companion signal..."
    : unlimitedShards
      ? "Roll summon / Unlimited shards"
      : "Roll summon / 100 Core Shards";
  $("summon-five").disabled =
    summonInProgress ||
    performance.now() < summonCooldownUntil ||
    (!unlimitedShards && state.shards < SUMMON_COST * 5);
  $("summon-five").textContent = unlimitedShards
    ? "5-pull / Unlimited shards"
    : "5-pull / 500 Core Shards";
  $("skip-summon").hidden = !summonInProgress;
  $("summon-chamber").setAttribute("aria-busy", String(summonInProgress));
  $("summon-party").hidden = !lastSummon || summonInProgress;
  if (
    !summonInProgress &&
    !lastSummon &&
    !unlimitedShards &&
    state.shards < SUMMON_COST
  )
    $("summon-message").textContent =
      `You have ${state.shards} Core Shards. Clear new stages to reach 100.`;
}
function revealSummon() {
  if (!summonInProgress) return;
  clearTimeout(summonRevealTimer);
  summonInProgress = false;
  $("summon-chamber").classList.remove("reconstructing");
  const result = $("summon-result");
  const pulls = lastSummon.results;
  result.classList.toggle("five-pull-results", pulls.length === 5);
  result.replaceChildren();
  for (const { unit, duplicate, copies } of pulls) {
    const card = element("div", undefined, "summon-card");
    card.append(
      sprite(unit),
      element("h3", unit.name),
      element("p", `${unit.rarity} / ${unit.role}`),
      element("p", unit.skill.name, "skill-name"),
    );
    if (pulls.length > 1)
      card.append(
        element(
          "p",
          duplicate ? `Duplicate / ${copies} copies` : "New companion",
        ),
      );
    result.append(card);
  }
  if (pulls.length === 1) {
    const { unit, duplicate, copies } = pulls[0];
    $("summon-message").textContent = duplicate
      ? `${unit.name}'s signal recovered again. You now own ${copies} copies. Your party is unchanged; spare duplicates can be spent on ascension in Your party.`
      : `${unit.name} summoned! Open Manage party, select a slot, and assign your new companion.`;
  } else {
    const newCount = pulls.filter((pull) => !pull.duplicate).length;
    $("summon-message").textContent =
      `Five signals recovered: ${newCount} new companions, ${5 - newCount} duplicates.`;
  }
  renderSummoning();
  animateElement(
    result,
    [
      { opacity: 0, transform: "scale(0.85)" },
      { opacity: 1, transform: "scale(1)" },
    ],
    { duration: 400, easing: "ease-out" },
  );
}
function startSummon(count = 1) {
  if (summonInProgress || performance.now() < summonCooldownUntil) return;
  const result = summonBatch(
    state,
    characters,
    count,
    Math.random,
    unlimitedShards,
  );
  if (!result.ok) {
    $("summon-message").textContent = result.message;
    return;
  }
  lastSummon = result;
  summonCooldownUntil = performance.now() + 400;
  setTimeout(renderSummoning, 410);
  save(); // Commit the outcome before animation: leaving or reloading cannot lose a roll.
  summonInProgress = true;
  $("summon-result").replaceChildren();
  $("summon-message").textContent =
    "Combining Core Shards... tracing a companion's signal.";
  renderSummoning();
  if (state.paused || reducedMotion.matches) {
    revealSummon();
    return;
  }
  $("summon-chamber").classList.add("reconstructing");
  summonRevealTimer = setTimeout(revealSummon, 1600);
}
function renderJournal() {
  $("entries").replaceChildren();
  campaigns.forEach((entry) => {
    const item = element("article", undefined, "journal-entry");
    item.append(
      element(
        "h3",
        `${entry.language} / ${state.completed[entry.id].length} of ${entry.stages.length} practice stages`,
      ),
      element(
        "p",
        state.completed[entry.id]
          .map((index) => entry.stages[index].title)
          .join(" / ") || "A new world awaits. Start whenever you like.",
      ),
    );
    $("entries").append(item);
  });
}
let lastCheckKind = null;
async function run(authoritative = false) {
  if (busy) return false;
  busy = true;
  document.body.setAttribute("aria-busy", "true");
  $("run").disabled = true;
  $("cast").disabled = true;
  $("code").readOnly = true;
  $("output").textContent = authoritative
    ? "Checking sample and transfer tests..."
    : "Running visible tests in an isolated browser worker...";
  renderMap();
  let result;
  try {
    result = await gradeBehavior(
      world.id,
      currentExercise(),
      $("code").value,
      authoritative,
    );
  } catch (error) {
    result = {
      ok: false,
      kind: "unavailable",
      message: "Runtime unavailable: " + error.message,
    };
  }
  busy = false;
  document.body.setAttribute("aria-busy", "false");
  lastCheckKind = result.kind;
  $("run").disabled = false;
  $("cast").disabled = won || partyDefeated;
  $("code").readOnly = won;
  $("output").textContent = result.message;
  renderMap();
  return result.ok;
}
async function cast() {
  if (busy || won || partyDefeated) return;
  if (!(await run(true))) {
    if (["unavailable", "unsupported"].includes(lastCheckKind)) return;
    await enemyRetaliation();
    return;
  }
  setCodeFocus(false);
  const submittedSource = $("code").value;
  const submittedExercise = currentExercise();
  busy = true;
  document.body.setAttribute("aria-busy", "true");
  $("cast").disabled = true;
  $("run").disabled = true;
  $("code").readOnly = true;
  renderMap();
  const stage = world.stages[stageIndex];
  const turn = resolveLessonTurn(
    battleParty,
    $("hp").value,
    stage.exercises.length - phase - 1,
  );
  $("hp").value = turn.hp;
  $("hp-text").textContent = `${turn.hp} / ${stage.enemy.hp}`;
  renderBattleParty();
  flashUntil = performance.now() + 650;
  animateElement(
    $("battle"),
    [
      { transform: "translateX(0)" },
      { transform: "translateX(-4px)", offset: 0.3 },
      { transform: "translateX(5px)", offset: 0.6 },
      { transform: "translateX(0)" },
    ],
    { duration: 380 },
  );
  document
    .querySelectorAll(".companion")
    .forEach((node, index) =>
      animateElement(
        node,
        [
          { transform: "translateY(0)" },
          { transform: "translateY(-10px)", borderColor: world.color },
          { transform: "translateY(0)" },
        ],
        { duration: 400, delay: index * 65 },
      ),
    );
  $("combat-log").textContent = "Your party strikes.";
  await new Promise((resolve) =>
    setTimeout(resolve, state.paused || reducedMotion.matches ? 50 : 750),
  );
  phase++;
  busy = false;
  document.body.setAttribute("aria-busy", "false");
  $("run").disabled = false;
  $("code").readOnly = false;
  if (phase < stage.exercises.length) {
    renderExercise();
    if (
      submittedExercise.entry &&
      submittedExercise.objective === currentExercise().objective
    )
      $("code").value = state.drafts[draftKey()] ?? submittedSource;
    hintIndex = 0;
    $("output").textContent =
      `Example ${phase} complete. Apply the lesson to the next input. ${phase}/${stage.exercises.length} objectives solved.`;
    renderMap();
    return;
  }
  won = true;
  $("code").readOnly = true;
  $("hp").value = 0;
  $("hp-text").textContent = `0 / ${stage.enemy.hp}`;
  const recruitedBefore = new Set(state.storyRecruits);
  const amount = rewardClear(state, world.id, stageIndex);
  const newRecruits = STORY_RECRUITS.filter(
    (recruit) =>
      state.storyRecruits.includes(recruit.id) &&
      !recruitedBefore.has(recruit.id),
  );
  pendingRecruitNotice = newRecruits
    .map((recruit) => `${recruit.name} joined! "${recruit.intro}"`)
    .join(" ");
  save();
  $("combat-log").textContent =
    "Corruption cleared. " +
    (pendingRecruitNotice ? pendingRecruitNotice + " " : "") +
    (amount
      ? `+${amount} Core Shards. `
      : "Practice replay: no duplicate rewards. ") +
    (stage.isBoss
      ? "Chapter checkpoint restored. Continue your independent language route."
      : "Your code made the difference.");
  $("output").textContent =
    stageIndex === world.stages.length - 1
      ? "Chapter cleared. Returning to campaigns automatically..."
      : "Stage cleared. Opening the next stage automatically...";
  renderMap();
  animateElement(
    document.querySelector(".battle-panel"),
    [
      { boxShadow: "inset 0 0 0 0 transparent" },
      { boxShadow: "inset 0 0 0 3px " + world.color },
      { boxShadow: "inset 0 0 0 0 transparent" },
    ],
    { duration: 700 },
  );
  const completedWorld = world;
  const completedStage = stageIndex;
  const version = navigationVersion;
  advanceTimer = setTimeout(() => {
    if (version !== navigationVersion || $("adventure").hidden) return;
    advanceTimer = null;
    if (completedStage === completedWorld.stages.length - 1) {
      showPage("worlds");
      const entryButton = $("world-list").querySelector("button");
      entryButton?.focus();
    } else enterStage(completedWorld, completedStage + 1);
  }, 1800);
}
$("code").addEventListener("input", () => {
  state.drafts[draftKey()] = $("code").value;
  save();
});
$("code").addEventListener("focus", () =>
  document.body.classList.add("editing"),
);
$("code").addEventListener("blur", () =>
  document.body.classList.remove("editing"),
);
$("code").addEventListener("keydown", (event) => {
  if (event.key === "Tab") {
    event.preventDefault();
    event.target.setRangeText(
      "    ",
      event.target.selectionStart,
      event.target.selectionEnd,
      "end",
    );
    event.target.dispatchEvent(new Event("input"));
  }
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    event.preventDefault();
    if (!busy) run(false);
  }
});
function setCodeFocus(focused) {
  document.body.classList.toggle("code-focused", focused);
  $("focus-code").setAttribute("aria-pressed", String(focused));
  $("focus-code").textContent = focused ? "Back to battle view" : "Full editor";
}
$("focus-code").onclick = () =>
  setCodeFocus(!document.body.classList.contains("code-focused"));
$("run").onclick = () => run(false);
$("cast").onclick = cast;
$("hint").onclick = () => {
  const exercise = currentExercise();
  const tier = Math.min(hintIndex++, exercise.hints.length - 1);
  $("output").textContent =
    tier < exercise.hints.length - 1
      ? `Hint ${tier + 1}: ${exercise.hints[tier]}`
      : "Worked solution:\n" + exercise.solution;
};
$("retry-battle").onclick = () => {
  battleParty = createBattleParty(state, characters);
  partyDefeated = false;
  $("cast").disabled = false;
  $("retry-battle").hidden = true;
  renderBattleParty();
  $("combat-log").textContent =
    "Party restored. Your draft and current boss seal are preserved. Run Code is safe practice.";
  $("code").focus();
};
$("back").onclick = () => showPage("worlds");
document
  .querySelectorAll("nav [data-page]")
  .forEach((button) => (button.onclick = () => showPage(button.dataset.page)));
$("summon").onclick = () => startSummon(1);
$("summon-five").onclick = () => startSummon(5);
$("skip-summon").onclick = revealSummon;
$("summon-party").onclick = () => showPage("party");
function motionLabel() {
  $("motion").textContent = state.paused
    ? "Resume animation"
    : "Pause animation";
  $("motion").setAttribute("aria-pressed", String(state.paused));
}
$("motion").onclick = () => {
  state.paused = !state.paused;
  motionLabel();
  if (state.paused) revealSummon();
  if (state.paused)
    document.getAnimations?.().forEach((animation) => animation.cancel());
  save();
};
motionLabel();
reducedMotion.addEventListener("change", () => {
  if (reducedMotion.matches) revealSummon();
  if (reducedMotion.matches)
    document.getAnimations?.().forEach((animation) => animation.cancel());
});
function drawFrame(time) {
  drawLandscape(
    $("battle"),
    world.id,
    state.paused || reducedMotion.matches ? 0 : time,
    state.party.map((id) => characters.find((c) => c.id === id)),
    !state.paused && !reducedMotion.matches && time < flashUntil,
  );
}
let lastFrame = 0;
function animate(time) {
  if (!$("adventure").hidden && time - lastFrame > 80) {
    drawFrame(time);
    lastFrame = time;
  }
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
save();
renderWorlds();
if ("serviceWorker" in navigator && location.protocol !== "file:")
  navigator.serviceWorker.register("./service-worker.js").catch(() => {});
