import { skillBitCost, skillReady, chargeFromAttack } from "./skill-charge.js";
import { skillPrompt } from "./skill-prompts.js";
import { runJava } from "./runners/java-subset.js";
import {
  characterStats,
  createBattleParty,
  retaliate,
  resolveLessonTurn,
} from "./combat.js";
import assert from "node:assert/strict";
import { campaigns, characters } from "./campaigns.js";
import { checkCode } from "./legacy-code-checks.js";
import {
  freshSave,
  loadSave,
  writeSave,
  rewardClear,
  rollCharacter,
  summonCharacter,
  summonBatch,
  ascendCharacter,
  availableDuplicates,
  recruitStoryCompanions,
  STORY_RECRUITS,
  replacePartyMember,
} from "./save-data.js";
let count = 0;
// Existing combat/economy tests intentionally use a complete owned test party.
function fullPartySave() {
  const state = freshSave();
  state.owned = { byte: 1, patch: 1, query: 1, echo: 1 };
  state.party = ["byte", "patch", "query", "echo"];
  return state;
}
function test(name, fn) {
  fn();
  count++;
  console.log("PASS " + name);
}
for (const world of campaigns) {
  test(world.id + " starts independently", () => {
    const save = fullPartySave();
    assert.equal(save.completed[world.id].length, 0);
    assert.equal(world.stages.length, 16);
  });
  for (const stage of world.stages.slice(0, 4)) {
    test(world.id + " " + stage.title + " accepts worked solution", () =>
      assert.equal(checkCode(world.id, stage.kind, stage.solution).ok, true),
    );
    test(world.id + " " + stage.title + " rejects empty input", () =>
      assert.equal(checkCode(world.id, stage.kind, "").ok, false),
    );
  }
  test(world.id + " boss second seal", () =>
    assert.equal(
      checkCode(
        world.id,
        "boss",
        world.stages[world.id === "sql" ? 2 : 1].solution,
        1,
      ).ok,
      true,
    ),
  );
}
test("SQL boundary excludes armor 20", () =>
  assert.equal(
    checkCode("sql", "filter", "SELECT name FROM enemies WHERE armor <= 20;")
      .ok,
    false,
  ));
test("SQL equivalent reversed comparison", () =>
  assert.equal(
    checkCode("sql", "filter", "select name from enemies where 20 > armor").ok,
    true,
  ));
test("SQL rejects appended write", () =>
  assert.equal(
    checkCode("sql", "all", "SELECT * FROM enemies; DROP TABLE enemies;").ok,
    false,
  ));
test("Python comment cannot impersonate solution", () =>
  assert.equal(
    checkCode("python", "hello", '# print("Hello, System!")').ok,
    false,
  ));
test("Java single quoted string rejected", () =>
  assert.equal(
    checkCode("java", "hello", "System.out.println('Hello, System!');").ok,
    false,
  ));
test("arithmetic alternative accepted", () =>
  assert.equal(checkCode("python", "addition", "print(4 + 6)").ok, true));
test("first clear reward cannot be duplicated", () => {
  const save = fullPartySave();
  assert.equal(rewardClear(save, "java", 0), 35);
  assert.equal(rewardClear(save, "java", 0), 0);
  assert.equal(save.shards, 235);
  assert.deepEqual(save.completed.python, []);
  assert.deepEqual(save.completed.sql, []);
});
test("malformed save recovers", () =>
  assert.deepEqual(loadSave({ getItem: () => "{oops" }), freshSave()));
test("untrusted wallet and invalid party recover", () => {
  const save = loadSave({
    getItem: () =>
      JSON.stringify({
        version: 2,
        shards: -1,
        party: ["unknown"],
        completed: { sql: [0, 0, 99] },
      }),
  });
  assert.equal(save.shards, 200);
  assert.deepEqual(save.party, ["byte", "patch"]);
  assert.deepEqual(save.completed.sql, [0]);
});
test("save continuity preserves drafts", () => {
  let raw;
  const storage = { getItem: () => raw, setItem: (_, value) => (raw = value) };
  const save = fullPartySave();
  save.drafts["python-0-0"] = 'print("hello")';
  rewardClear(save, "python", 0);
  assert.equal(writeSave(storage, save), true);
  assert.deepEqual(loadSave(storage), save);
});
test("storage denial is handled", () =>
  assert.equal(
    writeSave(
      {
        setItem: () => {
          throw Error();
        },
      },
      freshSave(),
    ),
    false,
  ));
for (const [value, rarity] of [
  [0, "Common"],
  [0.55, "Rare"],
  [0.85, "Epic"],
  [0.97, "Legendary"],
])
  test("summon boundary " + rarity, () => {
    let calls = 0;
    assert.equal(
      rollCharacter(characters, () => (calls++ === 0 ? value : 0)).rarity,
      rarity,
    );
  });
test("legacy gems migrate to shards without losing progress or party", () => {
  const old = { ...fullPartySave(), version: 1, gems: 145 };
  delete old.shards;
  old.owned.fern = 2;
  old.party[0] = "fern";
  old.completed.sql = [0];
  const migrated = loadSave({ getItem: () => JSON.stringify(old) });
  assert.equal(migrated.version, 4);
  assert.equal(migrated.shards, 145);
  assert.deepEqual(migrated.party, old.party);
  assert.deepEqual(migrated.completed.sql, [0]);
});
test("new summon charges once and adds an owned reserve", () => {
  const state = fullPartySave();
  let calls = 0;
  const result = summonCharacter(state, characters, () =>
    calls++ === 0 ? 0.9 : 0,
  );
  assert.equal(result.ok, true);
  assert.equal(result.duplicate, false);
  assert.equal(state.shards, 100);
  assert.equal(state.owned.nova, 1);
  assert.equal(state.party.length, 4);
});
test("duplicate summon tracks copies without changing party", () => {
  const state = fullPartySave();
  const party = [...state.party];
  const result = summonCharacter(state, characters, () => 0);
  assert.equal(result.duplicate, true);
  assert.equal(state.owned.byte, 2);
  assert.deepEqual(state.party, party);
});
test("insufficient shards never spend or award a character", () => {
  const state = fullPartySave();
  state.shards = 99;
  const before = structuredClone(state);
  assert.equal(summonCharacter(state, characters).ok, false);
  assert.deepEqual(state, before);
});
test("owned reserve replaces exactly the selected slot", () => {
  const state = fullPartySave();
  state.owned.nova = 1;
  assert.equal(replacePartyMember(state, 2, "nova").ok, true);
  assert.deepEqual(state.party, ["byte", "patch", "nova", "echo"]);
});
test("party rejects unowned, duplicate, and invalid slot assignments", () => {
  const state = fullPartySave();
  const before = [...state.party];
  for (const [slot, id] of [
    [0, "nova"],
    [1, "byte"],
    [null, "echo"],
    [4, "patch"],
  ])
    assert.equal(replacePartyMember(state, slot, id).ok, false);
  assert.deepEqual(state.party, before);
});
test("testing rolls work at zero balance without spending earned shards", () => {
  const state = fullPartySave();
  state.shards = 0;
  for (let i = 0; i < 20; i++)
    assert.equal(summonCharacter(state, characters, () => 0, true).ok, true);
  assert.equal(state.shards, 0);
  assert.equal(state.owned.byte, 21);
  assert.equal(summonCharacter(state, characters, () => 0, false).ok, false);
});
test("five-pull awards five copies and charges exactly 500 shards", () => {
  const state = fullPartySave();
  state.shards = 500;
  const result = summonBatch(state, characters, 5, () => 0);
  assert.equal(result.ok, true);
  assert.equal(result.results.length, 5);
  assert.equal(state.shards, 0);
  assert.equal(state.owned.byte, 6);
});
test("unaffordable five-pull changes nothing", () => {
  const state = fullPartySave();
  state.shards = 499;
  const before = structuredClone(state);
  assert.equal(summonBatch(state, characters, 5).ok, false);
  assert.deepEqual(state, before);
});
test("unlimited five-pull preserves wallet and uses independent draws", () => {
  const state = fullPartySave();
  state.shards = 0;
  let calls = 0;
  const result = summonBatch(
    state,
    characters,
    5,
    () => {
      calls++;
      return 0;
    },
    true,
  );
  assert.equal(result.results.length, 5);
  assert.equal(calls, 10);
  assert.equal(state.shards, 0);
  assert.equal(state.party.length, 4);
});
test("ascension consumes 1 then 3 then 5 spare duplicates, capped at 3", () => {
  const state = fullPartySave();
  state.owned.byte = 10;
  for (const [stars, remaining] of [
    [1, 8],
    [2, 5],
    [3, 0],
  ]) {
    assert.equal(ascendCharacter(state, "byte").stars, stars);
    assert.equal(availableDuplicates(state, "byte"), remaining);
  }
  assert.equal(ascendCharacter(state, "byte").ok, false);
  assert.equal(state.owned.byte, 10);
});
test("insufficient duplicates cannot ascend or consume the original", () => {
  const state = fullPartySave();
  assert.equal(ascendCharacter(state, "byte").ok, false);
  state.owned.byte = 4;
  assert.equal(ascendCharacter(state, "byte").ok, true);
  assert.equal(ascendCharacter(state, "byte").ok, false);
  assert.equal(state.party.length, 4);
});
test("ascension increases HP attack and defense", () => {
  const unit = characters[0];
  const base = characterStats(unit, 0);
  const upgraded = characterStats(unit, 3);
  for (const stat of ["hp", "attack", "defense"])
    assert.ok(upgraded[stat] > base[stat]);
});
test("ascensions survive saves while impossible saved ascensions are rejected", () => {
  const state = fullPartySave();
  state.owned.byte = 5;
  ascendCharacter(state, "byte");
  ascendCharacter(state, "byte");
  const restored = loadSave({ getItem: () => JSON.stringify(state) });
  assert.equal(restored.ascensions.byte, 2);
  state.ascensions.byte = 3;
  assert.equal(
    loadSave({ getItem: () => JSON.stringify(state) }).ascensions.byte,
    undefined,
  );
});
test("single attacks hit a living tank even outside slot one", () => {
  const state = fullPartySave();
  state.party = ["patch", "query", "byte", "echo"];
  const party = createBattleParty(state, characters);
  const result = retaliate(party, { type: "single", attack: 36 });
  assert.deepEqual(
    result.hits.map((hit) => hit.id),
    ["byte"],
  );
  assert.equal(party.find((unit) => unit.id === "byte").hp, 156);
  assert.equal(party[0].hp, 100);
});
test("AoE hits every living unit once", () => {
  const party = createBattleParty(fullPartySave(), characters);
  const result = retaliate(party, { type: "aoe", attack: 36 });
  assert.equal(result.hits.length, 4);
  assert.ok(party.every((unit) => unit.hp < unit.maxHp));
});
test("fallen tanks are skipped; no-tank parties target the first survivor", () => {
  const party = createBattleParty(fullPartySave(), characters);
  party[0].hp = 0;
  assert.deepEqual(
    retaliate(party, { type: "single", attack: 36 }).hits.map((hit) => hit.id),
    ["patch"],
  );
});
test("damage clamps health and defeat allows fresh retry state", () => {
  const state = fullPartySave();
  const party = createBattleParty(state, characters);
  assert.equal(retaliate(party, { type: "aoe", attack: 999 }).defeated, true);
  assert.ok(party.every((unit) => unit.hp === 0));
  assert.ok(
    createBattleParty(state, characters).every(
      (unit) => unit.hp === unit.maxHp,
    ),
  );
  assert.deepEqual(state.completed, { sql: [], python: [], java: [] });
});
for (const world of campaigns)
  for (const stage of world.stages.slice(0, 4)) {
    test(`${world.id} ${stage.title}: every authored variant and alternative passes`, () => {
      assert.equal(stage.exercises.length, stage.kind === "boss" ? 4 : 3);
      for (const exercise of stage.exercises)
        for (const solution of [exercise.solution, ...exercise.alternatives])
          assert.equal(
            checkCode(world.id, exercise.kind, solution, 0, exercise).ok,
            true,
            solution,
          );
    });
    test(`${world.id} ${stage.title}: previous example cannot solve next`, () => {
      for (let i = 1; i < stage.exercises.length; i++)
        assert.equal(
          checkCode(
            world.id,
            stage.exercises[i].kind,
            stage.exercises[i - 1].solution,
            0,
            stage.exercises[i],
          ).ok,
          false,
        );
    });
  }
test("baseline turn has 20 basic damage 40 attack damage and 40 utility", () => {
  const party = createBattleParty(fullPartySave(), characters);
  const turn = resolveLessonTurn(party, 180, 2);
  assert.equal(turn.auto, 20);
  assert.equal(turn.spell, 40);
  assert.equal(turn.utility, 40);
  assert.equal(turn.hp, 120);
  assert.equal(turn.shielded, 40);
  assert.equal(turn.healed, 0);
  const hit = retaliate(party, { type: "single", attack: 32 });
  assert.equal(hit.hits[0].absorbed, 10);
  assert.equal(hit.hits[0].damage, 10);
});
test("utility heals injured allies before applying leftover shielding", () => {
  const party = createBattleParty(fullPartySave(), characters);
  party[0].hp -= 25;
  const turn = resolveLessonTurn(party, 180, 2);
  assert.equal(turn.healed, 25);
  assert.equal(turn.shielded, 15);
  assert.equal(party[0].hp, party[0].maxHp);
});
test("starter and fully ascended parties need exactly three normal and four boss examples", () => {
  for (const stars of [0, 3])
    for (const turns of [3, 4]) {
      const state = fullPartySave();
      for (const id of state.party) state.ascensions[id] = stars;
      const party = createBattleParty(state, characters);
      let hp = turns * 60;
      for (let i = 0; i < turns; i++) {
        const result = resolveLessonTurn(party, hp, turns - i - 1);
        hp = result.hp;
        if (i < turns - 1) assert.ok(hp > 0);
        assert.ok(result.auto <= 25);
      }
      assert.equal(hp, 0);
    }
});
test("late exercise drafts survive save reload", () => {
  const state = fullPartySave();
  state.drafts["sql-3-3"] = "SELECT source FROM signals WHERE strength < 50;";
  assert.equal(
    loadSave({ getItem: () => JSON.stringify(state) }).drafts["sql-3-3"],
    state.drafts["sql-3-3"],
  );
});
test("authored SQL filtering preserves supported reversed comparison and explicit columns", () => {
  const filter = campaigns[0].stages[2].exercises[0];
  assert.equal(
    checkCode(
      "sql",
      filter.kind,
      "SELECT name FROM enemies WHERE 20 > armor;",
      0,
      filter,
    ).ok,
    true,
  );
  const all = campaigns[0].stages[0].exercises[0];
  assert.equal(
    checkCode(
      "sql",
      all.kind,
      "SELECT id, name, armor, hp FROM enemies;",
      0,
      all,
    ).ok,
    true,
  );
});
function team(ids) {
  const state = fullPartySave();
  state.party = ids;
  return createBattleParty(state, characters);
}
function member(id) {
  const unit = characters.find((unit) => unit.id === id);
  return {
    ...unit,
    ...characterStats(unit),
    maxHp: characterStats(unit).hp,
    shield: 0,
    correctTurns: 0,
  };
}
test("all 12 companions have unique skills and Sol has stronger individual stats", () => {
  assert.equal(new Set(characters.map((unit) => unit.skill.id)).size, 12);
  const sol = characterStats(characters.find((unit) => unit.id === "sol"));
  const pip = characterStats(characters.find((unit) => unit.id === "pip"));
  for (const stat of ["hp", "attack", "defense"])
    assert.ok(sol[stat] > pip[stat]);
});
function useSkill(party, id, hp = 180) {
  const unit = party.find((ally) => ally.id === id);
  unit.bits = skillBitCost(unit);
  return resolveLessonTurn(party, hp, 1, id);
}
test("lesson attacks charge living allies without automatically activating skills", () => {
  const party = [member("sol"), member("byte")];
  party[1].hp = 0;
  const turn = resolveLessonTurn(party, 180, 2);
  assert.equal(turn.revived, 0);
  assert.deepEqual(turn.skills, []);
  assert.equal(party[0].bits, 8);
  assert.equal(party[1].bits || 0, 0);
  assert.equal(turn.utility, 40);
});
test("different costs, readiness after two or three attacks, charge caps and ascension", () => {
  const party = characters.map((unit) => member(unit.id));
  assert.equal(new Set(party.map((unit) => skillBitCost(unit))).size, 12);
  chargeFromAttack(party);
  assert.ok(party.every((unit) => !skillReady(unit)));
  chargeFromAttack(party);
  assert.equal(skillReady(party.find((unit) => unit.id === "byte")), true);
  assert.equal(skillReady(party.find((unit) => unit.id === "sol")), false);
  chargeFromAttack(party);
  assert.ok(party.every(skillReady));
  chargeFromAttack(party);
  assert.ok(party.every((unit) => unit.bits === skillBitCost(unit)));
  assert.equal(skillBitCost(member("sol"), 3), 21);
});
test("uncharged and fallen skills cannot be spent; activation spends charge once", () => {
  const party = [member("byte")];
  party[0].bits = 8;
  assert.equal(resolveLessonTurn(party, 180, 2, "byte"), null);
  assert.equal(party[0].bits, 8);
  const turn = useSkill(party, "byte");
  assert.equal(party[0].bits, 0);
  assert.equal(turn.auto, 0);
  assert.equal(turn.shielded, 12);
  assert.equal(turn.hp, 180);
  assert.equal(resolveLessonTurn(party, 180, 2, "byte"), null);
  party[0].bits = 12;
  party[0].hp = 0;
  assert.equal(resolveLessonTurn(party, 180, 2, "byte"), null);
});
test("Patch heals; Bolt and Pip grant targeted shields only on manual activation", () => {
  const party = [
    member("patch"),
    member("bolt"),
    member("pip"),
    member("echo"),
  ];
  party[3].hp -= 30;
  assert.equal(useSkill(party, "patch").healed, 8);
  assert.equal(useSkill(party, "bolt").shielded, 8);
  assert.equal(party[1].shield, 8);
  assert.equal(useSkill(party, "pip").shielded, 8);
  assert.equal(party[0].shield, 8);
});
test("Query Echo and Nova deal their distinct skill damage without earning charge", () => {
  for (const [id, damage] of [
    ["query", 4],
    ["echo", 4],
    ["nova", 6],
  ]) {
    const party = [member(id)];
    const turn = useSkill(party, id);
    assert.equal(turn.spell, damage);
    assert.equal(turn.hp, 180 - damage);
    assert.equal(party[0].bits, 0);
  }
});
test("prepared Fern Rune and Atlas guards mitigate one matching enemy attack", () => {
  for (const [id, type, expected] of [
    ["fern", "single", 6],
    ["rune", "aoe", 4],
    ["atlas", "aoe", 8],
  ]) {
    const party = [member("byte"), member(id)];
    useSkill(party, id);
    assert.equal(
      retaliate(party, { type, attack: 32 }).hits[0].mitigation,
      expected,
    );
    assert.equal(retaliate(party, { type, attack: 32 }).hits[0].mitigation, 0);
  }
});
test("Zero's execute is conditional and skills cannot finish a lesson fight", () => {
  const party = [member("zero")];
  assert.equal(useSkill(party, "zero", 120).spell, 0);
  assert.equal(useSkill(party, "zero", 80).spell, 10);
  assert.equal(useSkill(party, "zero", 3).hp, 1);
});
test("Sol manually revives once per attempt and provides 16 utility", () => {
  const party = [member("sol"), member("byte")];
  party[1].hp = 0;
  const turn = useSkill(party, "sol");
  assert.equal(turn.utility, 16);
  assert.equal(turn.revived, 63);
  assert.ok(party[1].hp > 0);
  party[1].hp = 0;
  assert.equal(useSkill(party, "sol").revived, 0);
});
test("all character prompts have language contracts and Java solutions actually execute", () => {
  for (const unit of characters)
    for (const stage of [0, 4, 15]) {
      for (const language of ["sql", "python", "java"]) {
        const prompt = skillPrompt(unit, language, stage);
        assert.ok(prompt.objective.includes(unit.name));
        assert.ok(prompt.solution && prompt.hint && prompt.tests.length);
        if (language === "java")
          for (const sample of prompt.tests) {
            const result = runJava(prompt.solution, {
              entry: prompt.entry,
              args: sample.args,
            });
            assert.deepEqual(
              prompt.entry ? result.value : result.output,
              sample.expected,
            );
          }
      }
    }
});
test("every four-companion roster preserves all normal and boss lesson examples", () => {
  for (let a = 0; a < 9; a++)
    for (let b = a + 1; b < 10; b++)
      for (let c = b + 1; c < 11; c++)
        for (let d = c + 1; d < 12; d++) {
          const ids = [a, b, c, d].map((index) => characters[index].id);
          for (const turns of [3, 4]) {
            const state = fullPartySave();
            state.party = ids;
            for (const id of ids) state.ascensions[id] = 3;
            const party = createBattleParty(state, characters);
            let hp = turns * 60;
            for (let i = 0; i < turns; i++) {
              const turn = resolveLessonTurn(party, hp, turns - i - 1);
              hp = turn.hp;
              assert.ok(turn.auto <= 25);
              assert.ok(turn.spell <= 50);
              assert.ok(turn.utility <= 64);
              if (i < turns - 1) assert.ok(hp > 0);
            }
            assert.equal(hp, 0);
          }
        }
});
test("fresh battle and retry reset charge and legendary revival allowance", () => {
  const state = fullPartySave();
  state.party = ["sol", "byte", "query", "echo"];
  state.owned.sol = 1;
  const party = createBattleParty(state, characters);
  party[1].hp = 0;
  useSkill(party, "sol");
  assert.equal(party[0].revivalUsed, true);
  chargeFromAttack(party);
  const reset = createBattleParty(state, characters);
  assert.ok(reset.every((unit) => unit.bits === 0));
  assert.equal(reset[0].revivalUsed, false);
});
test("new games own and field only Byte Knight", () => {
  const state = freshSave();
  assert.deepEqual(state.owned, { byte: 1 });
  assert.deepEqual(state.party, ["byte"]);
  assert.equal(state.version, 4);
});
test("solo Byte can complete every current lesson battle without rare characters", () => {
  for (const world of campaigns)
    for (const stage of world.stages) {
      const state = freshSave();
      const party = createBattleParty(state, characters);
      let hp = stage.enemy.hp;
      for (let i = 0; i < stage.exercises.length; i++) {
        const result = resolveLessonTurn(
          party,
          hp,
          stage.exercises.length - i - 1,
        );
        hp = result.hp;
      }
      assert.equal(hp, 0);
      assert.ok(party[0].hp > 0);
    }
});
test("partial parties persist and older owned characters are preserved", () => {
  const state = freshSave();
  state.owned.patch = 1;
  state.party.push("patch");
  assert.deepEqual(loadSave({ getItem: () => JSON.stringify(state) }).party, [
    "byte",
    "patch",
  ]);
  const old = { ...fullPartySave(), version: 3 };
  const migrated = loadSave({ getItem: () => JSON.stringify(old) });
  assert.deepEqual(migrated.party, old.party);
  assert.deepEqual(migrated.owned, old.owned);
});
test("any campaign recruits Patch Echo and Pip in stage order", () => {
  for (const world of ["sql", "python", "java"]) {
    const state = freshSave();
    for (const [index, id] of [
      [0, "patch"],
      [1, "echo"],
      [2, "pip"],
    ]) {
      rewardClear(state, world, index);
      assert.equal(state.party[index + 1], id);
      assert.equal(state.owned[id], 1);
      assert.equal(state.party.length, index + 2);
    }
    assert.deepEqual(state.party, ["byte", "patch", "echo", "pip"]);
    assert.ok(
      STORY_RECRUITS.every(
        (recruit) =>
          characters.find((unit) => unit.id === recruit.id).rarity === "Common",
      ),
    );
  }
});
test("shared recruitment cannot be farmed through replays or another campaign", () => {
  const state = freshSave();
  rewardClear(state, "sql", 0);
  rewardClear(state, "sql", 0);
  rewardClear(state, "python", 0);
  rewardClear(state, "java", 0);
  assert.equal(state.owned.patch, 1);
  assert.equal(state.storyRecruits.length, 1);
  assert.deepEqual(state.party, ["byte", "patch"]);
});
test("already-summoned recruit grants no duplicate and full saved parties are never overwritten", () => {
  const state = fullPartySave();
  state.owned.pip = 2;
  state.completed.sql = [0, 1, 2];
  const before = [...state.party];
  recruitStoryCompanions(state);
  assert.deepEqual(state.party, before);
  assert.equal(state.owned.pip, 2);
  assert.deepEqual(state.storyRecruits, ["patch", "echo", "pip"]);
});
test("recruitment requires contiguous clears and survives reload", () => {
  const state = freshSave();
  state.completed.sql = [2];
  recruitStoryCompanions(state);
  assert.deepEqual(state.party, ["byte"]);
  state.completed.sql = [0, 1, 2];
  recruitStoryCompanions(state);
  const restored = loadSave({ getItem: () => JSON.stringify(state) });
  assert.deepEqual(restored.party, state.party);
  assert.deepEqual(restored.storyRecruits, state.storyRecruits);
});
test("equipping an early summoned recruit still assembles four guaranteed companions", () => {
  const state = freshSave();
  state.owned.patch = 1;
  state.party = ["patch"];
  rewardClear(state, "sql", 0);
  assert.equal(state.party.length, 2);
  assert.ok(state.party.includes("byte"));
  assert.equal(state.owned.patch, 1);
  rewardClear(state, "sql", 1);
  rewardClear(state, "sql", 2);
  assert.equal(state.party.length, 4);
  assert.deepEqual(
    new Set(state.party),
    new Set(["byte", "patch", "echo", "pip"]),
  );
});
for (const stage of campaigns
  .find((world) => world.id === "java")
  .stages.slice(4))
  test(`Java behavior reference: ${stage.title}`, () => {
    for (const exercise of stage.exercises)
      for (const testCase of exercise.tests) {
        assert.deepEqual(
          runJava(exercise.solution, {
            entry: exercise.entry,
            args: testCase.args,
          }).value,
          testCase.expected,
        );
      }
  });
test("bounded Java accepts different algorithms instead of matching source text", () => {
  const code =
    "public static int solve(int[] values, int target) { int i = 0; int count = 0; while (i < values.length) { if (values[i] > target) { count += 1; } i += 1; } return count; }";
  assert.equal(
    runJava(code, { entry: "solve", args: [[1, 7, 8], 5] }).value,
    2,
  );
  assert.throws(() => runJava("while (true) {}"), /limit/);
  assert.throws(() => runJava("System.exit(0);"), /Unsupported/);
});
test("extended stage progress and late drafts survive migration", () => {
  const state = freshSave();
  state.completed.java = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  state.drafts["java-15-3"] = "return solution;";
  const restored = loadSave({ getItem: () => JSON.stringify(state) });
  assert.deepEqual(restored.completed.java, state.completed.java);
  assert.equal(restored.drafts["java-15-3"], state.drafts["java-15-3"]);
  assert.equal(rewardClear(state, "java", 11), 60);
});
test("Java teaching runner rejects invalid primitive assignments and non-Boolean conditions", () => {
  assert.throws(() => runJava("int flag = true;"), /Type mismatch/);
  assert.throws(
    () => runJava("if (1) { System.out.println(1); }"),
    /Type mismatch/,
  );
  assert.throws(
    () => runJava("int value; System.out.println(value);"),
    /initialized/,
  );
});
test("Java print and println have distinct output behavior", () => {
  assert.equal(
    runJava('System.out.print("Hello, "); System.out.println("System!");')
      .output,
    "Hello, System!",
  );
});
console.log(count + " behavior checks passed.");
