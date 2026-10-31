import assert from "node:assert/strict";
import { campaigns, characters } from "./campaigns.js";
import { checkCode } from "./code-checks.js";
import {
  freshSave,
  loadSave,
  writeSave,
  rewardClear,
  rollCharacter,
} from "./save-data.js";
let count = 0;
function test(name, fn) {
  fn();
  count++;
  console.log("PASS " + name);
}
for (const world of campaigns) {
  test(world.id + " starts independently", () => {
    const save = freshSave();
    assert.equal(save.completed[world.id].length, 0);
    assert.equal(world.stages.length, 4);
  });
  for (const stage of world.stages) {
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
  const save = freshSave();
  assert.equal(rewardClear(save, "java", 0), 35);
  assert.equal(rewardClear(save, "java", 0), 0);
  assert.equal(save.gems, 235);
  assert.deepEqual(save.completed.python, []);
  assert.deepEqual(save.completed.sql, []);
});
test("malformed save recovers", () =>
  assert.deepEqual(loadSave({ getItem: () => "{oops" }), freshSave()));
test("untrusted wallet and invalid party recover", () => {
  const save = loadSave({
    getItem: () =>
      JSON.stringify({
        version: 1,
        gems: -1,
        party: ["unknown"],
        completed: { sql: [0, 0, 99] },
      }),
  });
  assert.equal(save.gems, 200);
  assert.equal(save.party.length, 4);
  assert.deepEqual(save.completed.sql, [0]);
});
test("save continuity preserves drafts", () => {
  let raw;
  const storage = { getItem: () => raw, setItem: (_, value) => (raw = value) };
  const save = freshSave();
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
console.log(count + " behavior checks passed.");
