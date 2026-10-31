import { campaigns, characters, enemies } from "./campaigns.js";
import { checkCode } from "./code-checks.js";
import {
  loadSave,
  writeSave,
  rewardClear,
  rollCharacter,
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
let world = campaigns[0],
  stageIndex = 0,
  phase = 0,
  hintIndex = 0,
  won = false,
  busy = false,
  replacement = null,
  flashUntil = 0;
let advanceTimer = null;
let navigationVersion = 0;
function cancelAdvance() {
  clearTimeout(advanceTimer);
  advanceTimer = null;
  navigationVersion++;
}
function animateElement(node, frames, options) {
  if (state.paused || reducedMotion.matches || !node.animate) return;
  node.animate(frames, options);
}
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
function save() {
  if (!writeSave(storage, state))
    $("combat-log").textContent =
      "Storage unavailable. Progress cannot be saved after this session.";
  $("gems").textContent = state.gems;
}
function showPage(name) {
  if (busy) return;
  cancelAdvance();
  document.body.dataset.page = name;
  document
    .querySelectorAll("main>section:not(.intro)")
    .forEach((section) => (section.hidden = section.id !== name));
  document.querySelector(".intro").hidden = name !== "worlds";
  document.querySelectorAll("[data-page]").forEach((button) => {
    if (button.dataset.page === name)
      button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
  if (name === "worlds") renderWorlds();
  if (name === "party") {
    replacement = null;
    renderParty();
  }
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
        `0${index + 1} / ${entry.language.toUpperCase()} ? ${entry.core}`,
        "world-meta",
      ),
      element("h3", entry.name),
      element("p", entry.description),
    );
    const button = element(
      "button",
      (state.completed[entry.id].length ? "Continue journey" : "Enter world") +
        " ?",
    );
    button.onclick = () => {
      const next = entry.stages.findIndex(
        (_, i) => !state.completed[entry.id].includes(i),
      );
      enterStage(entry, next < 0 ? 3 : next);
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
        `${state.completed[entry.id].length} / 4 STAGES RESTORED`,
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
function renderStage() {
  const stage = world.stages[stageIndex];
  $("world-label").textContent = world.language + " / " + world.name;
  $("stage-title").textContent = stage.title;
  $("stage-count").textContent = `${stageIndex + 1} / 4`;
  $("objective").textContent = stage.objective;
  $("lesson").textContent = stage.lesson;
  $("language").textContent = world.language + " / PRACTICE";
  $("location").textContent = world.core;
  $("example").textContent =
    world.id === "sql"
      ? "enemies\nid | name     | armor | hp\n" +
        enemies
          .map(
            (row) =>
              `${row.id}  | ${row.name.padEnd(8)} | ${String(row.armor).padEnd(5)} | ${row.hp}`,
          )
          .join("\n")
      : stage.example;
  $("runtime-note").textContent =
    world.id === "sql"
      ? "Small read-only SQL subset, not SQLite. Checks only the displayed dataset."
      : "Demo: limited pattern checks. Your code is not executed or compiled. Java input is statements inside main.";
  $("code").value = state.drafts[draftKey()] ?? stage.starter;
  $("output").textContent =
    "Read the objective, try your code, then cast when ready.";
  $("combat-log").textContent =
    "Your party is ready. Coding has no time limit.";
  $("hp").value = 100;
  $("hp-text").textContent = "100 / 100";
  $("cast").disabled = false;
  renderMap();
  $("battle-party").replaceChildren();
  state.party.forEach((id) => {
    const unit = characters.find((c) => c.id === id);
    const block = element("div", undefined, "companion");
    block.append(sprite(unit), document.createTextNode(unit.name));
    $("battle-party").append(block);
  });
  drawFrame(0);
}
function renderMap() {
  const map = $("stage-map");
  map.replaceChildren();
  world.stages.forEach((stage, index) => {
    const button = element(
      "button",
      `${state.completed[world.id].includes(index) ? "? " : ""}${index === 3 ? "Boss" : "Stage " + (index + 1)}`,
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
  const list = $("roster");
  list.replaceChildren();
  characters.forEach((unit) => {
    const card = element("article", undefined, "unit-card");
    const selected = state.party.includes(unit.id);
    const button = element(
      "button",
      selected
        ? replacement === unit.id
          ? "Choose reserve below"
          : "In party ? replace"
        : "Add to party",
    );
    button.disabled = !state.owned[unit.id];
    button.className = selected ? "" : "secondary";
    button.onclick = () => {
      if (selected) {
        replacement = unit.id;
        renderParty();
        $("party-message").textContent =
          "Choose an owned reserve companion to replace " + unit.name + ".";
      } else if (replacement) {
        state.party[state.party.indexOf(replacement)] = unit.id;
        replacement = null;
        save();
        renderParty();
        $("party-message").textContent = unit.name + " joined your party.";
      } else
        $("party-message").textContent =
          "Select a party companion to replace first.";
    };
    card.append(
      sprite(unit),
      element("h3", unit.name),
      element(
        "p",
        `${unit.role} / ${unit.rarity} / ${state.owned[unit.id] ? "Owned ?" + state.owned[unit.id] : "Not summoned"}`,
      ),
      button,
    );
    list.append(card);
  });
  $("summon").disabled = state.gems < 100;
}
function renderJournal() {
  $("entries").replaceChildren();
  campaigns.forEach((entry) => {
    const item = element("article", undefined, "journal-entry");
    item.append(
      element(
        "h3",
        `${entry.language} / ${state.completed[entry.id].length} of 4 practice stages`,
      ),
      element(
        "p",
        state.completed[entry.id]
          .map((index) => entry.stages[index].title)
          .join(" ? ") || "A new world awaits. Start whenever you like.",
      ),
    );
    $("entries").append(item);
  });
}
function run() {
  const result = checkCode(
    world.id,
    world.stages[stageIndex].kind,
    $("code").value,
    phase,
  );
  $("output").textContent = result.message;
  return result.ok;
}
async function cast() {
  if (busy || won || !run()) return;
  busy = true;
  $("cast").disabled = true;
  $("run").disabled = true;
  $("code").readOnly = true;
  renderMap();
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
  $("combat-log").textContent =
    state.party
      .map((id) => characters.find((c) => c.id === id).name)
      .join(", ") + " attack! Your code breaks the corruption.";
  await new Promise((resolve) =>
    setTimeout(resolve, state.paused || reducedMotion.matches ? 50 : 750),
  );
  phase++;
  busy = false;
  $("run").disabled = false;
  $("code").readOnly = false;
  if (stageIndex === 3 && phase === 1) {
    $("hp").value = 50;
    $("hp-text").textContent = "50 / 100";
    $("output").textContent =
      "First seal broken. Now " +
      (world.id === "sql"
        ? "retrieve names where armor is below 20."
        : "set energy to 10 and print it.");
    $("code").value =
      state.drafts[draftKey()] ??
      (world.id === "sql"
        ? "SELECT name FROM enemies WHERE armor < ___;"
        : world.id === "python"
          ? "energy = ___\nprint(energy)"
          : "int energy = ___;\nSystem.out.println(energy);");
    $("cast").disabled = false;
    hintIndex = 0;
    renderMap();
    return;
  }
  won = true;
  $("hp").value = 0;
  $("hp-text").textContent = "0 / 100";
  const amount = rewardClear(state, world.id, stageIndex);
  save();
  $("combat-log").textContent =
    "Corruption cleared. " +
    (amount
      ? `+${amount} Byte Gems. `
      : "Practice replay: no duplicate rewards. ") +
    (stageIndex === 3
      ? "Prototype chapter restored! More chapters and full endings are planned."
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
    if (!busy) run();
  }
});
$("run").onclick = run;
$("cast").onclick = cast;
$("hint").onclick = () => {
  let answer = world.stages[stageIndex].solution;
  if (stageIndex === 3 && phase === 1)
    answer =
      world.id === "sql"
        ? "SELECT name FROM enemies WHERE armor < 20;"
        : world.id === "python"
          ? "energy = 10\nprint(energy)"
          : "int energy = 10;\nSystem.out.println(energy);";
  $("output").textContent =
    hintIndex++ === 0
      ? "Hint: " +
        (phase === 1
          ? "Follow the second objective in the terminal."
          : world.stages[stageIndex].lesson)
      : "Worked solution:\n" + answer;
};
$("back").onclick = () => showPage("worlds");
document
  .querySelectorAll("[data-page]")
  .forEach((button) => (button.onclick = () => showPage(button.dataset.page)));
$("summon").onclick = () => {
  if (state.gems < 100) return;
  state.gems -= 100;
  const unit = rollCharacter(characters);
  state.owned[unit.id] = (state.owned[unit.id] || 0) + 1;
  save();
  renderParty();
  $("party-message").textContent =
    `Summoned ${unit.name} (${unit.rarity})! ${state.owned[unit.id] > 1 ? "Duplicate added to your collection." : "A new companion is ready."}`;
};
function motionLabel() {
  $("motion").textContent = state.paused
    ? "Resume animation"
    : "Pause animation";
  $("motion").setAttribute("aria-pressed", String(state.paused));
}
$("motion").onclick = () => {
  state.paused = !state.paused;
  motionLabel();
  if (state.paused)
    document.getAnimations?.().forEach((animation) => animation.cancel());
  save();
};
motionLabel();
reducedMotion.addEventListener("change", () => {
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
