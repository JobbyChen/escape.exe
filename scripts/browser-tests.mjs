// Local browser regression checks using installed Edge and Node's built-in CDP transport.
// Run: node scripts/browser-tests.mjs (Windows, Microsoft Edge required).
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { resolve, extname } from "node:path";
import { campaigns } from "./campaigns.js";
const root = resolve(import.meta.dirname, "..");
const layoutOnly =
  process.argv.includes("--layout-only") ||
  process.argv.includes("--problem-layout-only");
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const server = createServer(async (req, res) => {
  const path = resolve(
    root,
    "." +
      new URL(req.url, "http://localhost").pathname.replace(
        /\/$/,
        "/index.html",
      ),
  );
  if (!path.startsWith(root + "\\")) {
    res.writeHead(403).end();
    return;
  }
  try {
    const body = await readFile(path);
    const type = {
      ".html": "text/html",
      ".js": "text/javascript",
      ".css": "text/css",
      ".svg": "image/svg+xml",
      ".webmanifest": "application/manifest+json",
      ".wasm": "application/wasm",
      ".json": "application/json",
      ".zip": "application/zip",
    }[extname(path)];
    res.writeHead(200, { "Content-Type": type || "text/plain" }).end(body);
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const url = `http://127.0.0.1:${server.address().port}/?shards=earned`;
const profile = resolve(root, ".tools", "browser-check-" + Date.now());
await mkdir(profile, { recursive: true });
const edge = spawn(
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "--remote-debugging-port=0",
    `--user-data-dir=${profile}`,
    "about:blank",
  ],
  { windowsHide: true, stdio: "ignore" },
);
let ws, send;
try {
  let port;
  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      port = (
        await readFile(resolve(profile, "DevToolsActivePort"), "utf8")
      ).split("\n")[0];
      break;
    } catch {
      await pause(100);
    }
  }
  assert.ok(port, "Edge did not start a debugging session");
  const targets = await (
    await fetch(`http://127.0.0.1:${port}/json`, {
      signal: AbortSignal.timeout(8000),
    })
  ).json();
  ws = new WebSocket(
    targets.find((target) => target.type === "page").webSocketDebuggerUrl,
  );
  await new Promise((resolve, reject) => {
    ws.addEventListener("open", resolve, { once: true });
    ws.addEventListener("error", reject, { once: true });
  });
  const pending = new Map();
  let sequence = 0;
  ws.addEventListener("message", (event) => {
    const data = JSON.parse(event.data);
    if (data.id && pending.has(data.id)) {
      const task = pending.get(data.id);
      pending.delete(data.id);
      data.error
        ? task.reject(Error(data.error.message))
        : task.resolve(data.result);
    }
  });
  send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const id = ++sequence;
      pending.set(id, { resolve, reject });
      setTimeout(() => {
        if (pending.delete(id)) reject(Error("CDP timeout: " + method));
      }, 60000).unref();
      ws.send(JSON.stringify({ id, method, params }));
    });
  const evaluate = async (expression) => {
    const result = await send("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (result.exceptionDetails)
      throw Error(
        result.exceptionDetails.text +
          " " +
          JSON.stringify(result.exceptionDetails.exception),
      );
    if (expression.includes(".click()")) {
      for (let attempt = 0; attempt < 2000; attempt++) {
        const activity = await send("Runtime.evaluate", {
          expression: 'document.body?.getAttribute("aria-busy")',
          returnByValue: true,
        });
        if (activity.result.value !== "true") break;
        await pause(25);
      }
    }
    return result.result.value;
  };
  await send("Page.enable");
  await send("Page.bringToFront");
  await send("Emulation.setDeviceMetricsOverride", {
    width: 1280,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await send("Page.navigate", { url });
  for (let i = 0; i < 100; i++) {
    if (await evaluate('Boolean(document.querySelector(".world-card"))')) break;
    await pause(50);
  }
  assert.equal(
    await evaluate('document.querySelectorAll(".world-card").length'),
    3,
  );
  const click = (selector) =>
    evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
  const layout = () =>
    evaluate(
      `({width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight,nav:document.querySelector('nav').getBoundingClientRect().toJSON(),content:document.querySelector('main>section:not(.intro):not([hidden])').getBoundingClientRect().toJSON(),cast:document.querySelector('#cast').getBoundingClientRect().toJSON()})`,
    );
  let checks = 0;
  function check(name, fn) {
    fn();
    checks++;
    console.log("PASS " + name);
  }
  for (const size of [
    [1280, 900],
    [1280, 720],
    [1440, 900],
    [1897, 783],
    [1920, 1080],
    [1920, 800],
    [1536, 640],
  ]) {
    await send("Emulation.setDeviceMetricsOverride", {
      width: size[0],
      height: size[1],
      deviceScaleFactor: 1,
      mobile: false,
    });
    await click('[data-page="worlds"]');
    const bounds = await layout();
    check("desktop viewport and right sidebar " + size.join("x"), () => {
      assert.ok(bounds.scrollHeight <= bounds.height + 1);
      assert.ok(bounds.scrollWidth <= bounds.width);
      assert.ok(bounds.nav.x >= bounds.content.right);
    });
    const cards =
      await evaluate(`Array.from(document.querySelectorAll('.world-card'), card => {
      const description=card.querySelector('p');
      const text=document.createRange();text.selectNodeContents(description);
      return {text:text.getBoundingClientRect().toJSON(),button:card.querySelector('button').getBoundingClientRect().toJSON(),card:card.getBoundingClientRect().toJSON(),progress:card.querySelector('small').getBoundingClientRect().toJSON()};
    })`);
    check("campaign text and buttons do not overlap " + size.join("x"), () => {
      for (const card of cards) {
        assert.ok(
          card.text.bottom + 8 <= card.button.top,
          JSON.stringify(card),
        );
        assert.ok(
          card.progress.bottom <= card.card.bottom,
          JSON.stringify(card),
        );
      }
    });
    if (size[0] === 1897) {
      await pause(300);
      const shot = await send("Page.captureScreenshot", { format: "png" });
      await writeFile(
        resolve(root, ".tools", "campaign-cards.png"),
        Buffer.from(shot.data, "base64"),
      );
    }
    await click(".world-card button");
    const battleBounds = await layout();
    const editorBounds = await evaluate(
      '({panel:document.querySelector(".coding-panel").getBoundingClientRect().toJSON(),output:document.querySelector("#output").getBoundingClientRect().toJSON()})',
    );
    check("battle editor fits " + size.join("x"), () => {
      assert.ok(
        battleBounds.cast.bottom <= battleBounds.height,
        JSON.stringify(battleBounds),
      );
      assert.ok(
        editorBounds.output.bottom <= editorBounds.panel.bottom + 1,
        JSON.stringify(editorBounds),
      );
    });
    if (size[1] === 720) {
      await pause(300);
      const image = await send("Page.captureScreenshot", { format: "png" });
      await writeFile(
        resolve(root, ".tools", "desktop-battle.png"),
        Buffer.from(image.data, "base64"),
      );
    }
    for (const page of ["party", "reconstruction", "journal"]) {
      await click(`[data-page="${page}"]`);
      const b = await layout();
      check(page + " fits desktop " + size.join("x"), () =>
        assert.ok(b.scrollHeight <= b.height + 1),
      );
    }
  }
  if (process.argv.includes("--problem-layout-only")) {
    await evaluate(
      `localStorage.setItem('escape-exe-save-v1',JSON.stringify({version:4,shards:200,owned:{byte:1},party:['byte'],completed:{sql:[],python:[],java:Array.from({length:15},(_,i)=>i)},ascensions:{},storyRecruits:[]}));location.reload()`,
    );
    await pause(700);
    for (let i = 0; i < 100; i++) {
      if (await evaluate('document.querySelectorAll(".world-card").length===3'))
        break;
      await pause(50);
    }
    await evaluate(
      'document.querySelectorAll(".world-card button")[2].click()',
    );
    for (const [width, height] of [
      [1280, 720],
      [1536, 640],
      [390, 844],
    ]) {
      await send("Emulation.setDeviceMetricsOverride", {
        width,
        height,
        deviceScaleFactor: 1,
        mobile: width < 1024,
      });
      await evaluate('document.querySelector("#worked-lesson").open=true');
      const bounds = await layout();
      const example = await evaluate(
        '({visible:!document.querySelector("#worked-lesson").hidden,code:document.querySelector("#worked-example").textContent})',
      );
      check(
        `long problem and worked example stay usable ${width}x${height}`,
        () => {
          assert.ok(example.visible);
          assert.ok(example.code.length > 20);
          assert.ok(bounds.scrollWidth <= width);
          if (width >= 1024) assert.ok(bounds.cast.bottom <= height);
        },
      );
      if (width >= 1024) {
        await click("#focus-code");
        const expanded = await evaluate(
          '({editor:document.querySelector("#code").getBoundingClientRect().toJSON(),height:innerHeight})',
        );
        check(
          `full editor provides room for multi-line solutions ${width}`,
          () => assert.ok(expanded.editor.height > 200),
        );
        await evaluate(
          'document.querySelector("#code").value="";document.querySelector("#cast").click()',
        );
        const returned = await evaluate(
          'document.body.classList.contains("code-focused")',
        );
        check(
          "casting returns from full editor to visible combat " + width,
          () => assert.equal(returned, false),
        );
      }
      if (width === 1280) {
        await pause(300);
        const shot = await send("Page.captureScreenshot", { format: "png" });
        await writeFile(
          resolve(root, ".tools", "learning-problem.png"),
          Buffer.from(shot.data, "base64"),
        );
      }
    }
  }
  if (process.argv.includes("--skills-only")) {
    await send("Emulation.setEmulatedMedia", {
      features: [{ name: "prefers-reduced-motion", value: "reduce" }],
    });
    for (const language of ["sql", "python", "java"])
      for (const stage of [0, 4]) {
        const completed = { sql: [], python: [], java: [] };
        completed[language] = Array.from({ length: stage }, (_, i) => i);
        await evaluate(
          `localStorage.setItem('escape-exe-save-v1',JSON.stringify(${JSON.stringify({ version: 4, shards: 200, owned: { byte: 1, sol: 1, query: 1, echo: 1 }, party: ["byte", "sol", "query", "echo"], completed, ascensions: {}, storyRecruits: [] })}));location.reload()`,
        );
        await pause(700);
        await evaluate(
          `document.querySelectorAll('.world-card button')[${["sql", "python", "java"].indexOf(language)}].click()`,
        );
        const readCharge = () =>
          evaluate(
            'document.querySelector("[data-unit=byte] .skill-charge").value',
          );
        check(
          `${language} stage ${stage + 1} begins with empty charge`,
          () => {},
        );
        assert.equal(await readCharge(), 0);
        for (let i = 0; i < 2; i++) {
          await evaluate(
            `document.querySelector('#code').value=${JSON.stringify(campaigns.find((world) => world.id === language).stages[stage].exercises[i].solution)};document.querySelector('#cast').click()`,
          );
          await pause(100);
        }
        const snapshot = await evaluate(
          '({charge:document.querySelector("[data-unit=byte] .skill-charge").value,ready:document.querySelector("[data-unit=byte]").classList.contains("skill-ready"),sol:document.querySelector("[data-unit=sol] .skill-trigger").disabled,phase:document.querySelector("#exercise-progress").textContent,draft:document.querySelector("#code").value,save:localStorage.getItem("escape-exe-save-v1")})',
        );
        check(
          `${language} two attacks charge Byte while Sol needs a third`,
          () => {
            assert.equal(snapshot.charge, 12);
            assert.equal(snapshot.ready, true);
            assert.equal(snapshot.sol, true);
          },
        );
        await click("[data-unit=byte] .skill-trigger");
        assert.equal(
          await evaluate('document.querySelector("#skill-dialog").open'),
          true,
        );
        await evaluate(
          'document.querySelector("#skill-code").value="wrong";document.querySelector("#skill-run").click()',
        );
        check(`${language} safe skill practice preserves charge`, () => {});
        assert.equal(await readCharge(), 12);
        await click("#skill-use");
        assert.equal(
          await evaluate('document.querySelector("#skill-dialog").open'),
          false,
        );
        assert.equal(await readCharge(), 12);
        await click("[data-unit=byte] .skill-trigger");
        const solution = await evaluate(
          `(async()=>{const {skillPrompt}=await import('./scripts/skill-prompts.js');const {characters}=await import('./scripts/characters.js');return skillPrompt(characters[0],${JSON.stringify(language)},${stage}).solution})()`,
        );
        await evaluate(
          `document.querySelector('#skill-code').value=${JSON.stringify(solution)};document.querySelector('#skill-run').click()`,
        );
        assert.equal(await readCharge(), 12);
        if (stage === 4) {
          await evaluate(
            `document.querySelector('#skill-code').value=${JSON.stringify(language === "sql" ? "SELECT * FROM firewall;" : language === "python" ? "def solve(power):\n    return 9" : "static int solve(int power) { return 9; }")};document.querySelector('#skill-use').click()`,
          );
          assert.equal(await readCharge(), 12);
          await click("[data-unit=byte] .skill-trigger");
        }
        await evaluate(
          `document.querySelector('#skill-code').value=${JSON.stringify(solution)};document.querySelector('#skill-use').click();document.querySelector('#skill-use').click()`,
        );
        const after = await evaluate(
          '({charge:document.querySelector("[data-unit=byte] .skill-charge").value,phase:document.querySelector("#exercise-progress").textContent,draft:document.querySelector("#code").value,save:localStorage.getItem("escape-exe-save-v1"),open:document.querySelector("#skill-dialog").open,ready:document.querySelector("[data-unit=byte]").classList.contains("skill-ready")})',
        );
        check(
          `${language} skill spends once and preserves lesson draft, progress and rewards`,
          () => {
            assert.equal(after.charge, 0);
            assert.equal(after.ready, false);
            assert.equal(after.open, false);
            assert.equal(after.phase, snapshot.phase);
            assert.equal(after.draft, snapshot.draft);
            assert.equal(after.save, snapshot.save);
          },
        );
        await click("[data-unit=query] .skill-trigger");
        for (const [width, height] of [
          [1920, 1080],
          [390, 844],
          [844, 390],
        ]) {
          await send("Emulation.setDeviceMetricsOverride", {
            width,
            height,
            deviceScaleFactor: 1,
            mobile: width < 1024,
          });
          const bounds = await evaluate(
            '({dialog:document.querySelector("#skill-dialog").getBoundingClientRect().toJSON(),width:innerWidth,height:innerHeight})',
          );
          check(`skill prompt fits ${language} ${width}x${height}`, () => {
            assert.ok(bounds.dialog.x >= 0);
            assert.ok(bounds.dialog.right <= width);
            assert.ok(bounds.dialog.height <= height);
          });
        }
        await click("#close-skill");
        await send("Emulation.setDeviceMetricsOverride", {
          width: 1280,
          height: 720,
          deviceScaleFactor: 1,
          mobile: false,
        });
      }
    for (const language of ["sql", "python", "java"]) {
      const results = await evaluate(
        `(async()=>{const {gradeBehavior}=await import('./scripts/behavior-grading.js');const {skillPrompt}=await import('./scripts/skill-prompts.js');const {characters}=await import('./scripts/characters.js');const results=[];for(const unit of characters)for(const stage of [0,4]){const prompt=skillPrompt(unit,${JSON.stringify(language)},stage);const result=await gradeBehavior(${JSON.stringify(language)},prompt,prompt.solution,true);results.push({unit:unit.id,stage,...result});}return results})()`,
      );
      check(
        `${language} all character prompt solutions pass real browser grading`,
        () => {
          for (const result of results)
            assert.equal(result.ok, true, JSON.stringify(result));
        },
      );
    }
    console.log(`${checks} layout and manual skill checks passed.`);
  } else if (
    process.argv.includes("--learning-only") ||
    process.argv.includes("--runtime-smoke")
  ) {
    if (!process.argv.includes("--runtime-smoke"))
      for (const world of campaigns)
        for (const stage of world.stages)
          for (const [phase, exercise] of stage.exercises.entries()) {
            const grade = await evaluate(
              `(async()=>{const {gradeBehavior}=await import('./scripts/behavior-grading.js');const {campaigns}=await import('./scripts/campaigns.js');const exercise=campaigns.find(world=>world.id===${JSON.stringify(world.id)}).stages[${world.stages.indexOf(stage)}].exercises[${phase}];return await gradeBehavior(${JSON.stringify(world.id)},exercise,exercise.solution,true);})()`,
            );
            check(
              `${world.id} ${stage.title} example ${phase + 1} passes behavior tests`,
              () => assert.equal(grade.ok, true, grade.message),
            );
          }
    const alternatePython = "def solve(a, b, c):\n    return max(a, b, c)";
    const hardcodedPython = "def solve(a, b, c):\n    return 9";
    const infinitePython = "def solve(a, b, c):\n    while True:\n        pass";
    const behavior = await evaluate(
      `(async()=>{const {gradeBehavior}=await import('./scripts/behavior-grading.js');const {campaigns}=await import('./scripts/campaigns.js');const exercise=campaigns[1].stages[4].exercises[0];const valid=await gradeBehavior('python',exercise,${JSON.stringify(alternatePython)},true);const visible=await gradeBehavior('python',exercise,${JSON.stringify(hardcodedPython)},false);const hidden=await gradeBehavior('python',exercise,${JSON.stringify(hardcodedPython)},true);const infinite=await gradeBehavior('python',exercise,${JSON.stringify(infinitePython)},true);return {valid,visible,hidden,infinite};})()`,
    );
    check(
      "Python accepts alternate algorithms and hidden cases reject hard-coding",
      () => {
        assert.equal(behavior.valid.ok, true, behavior.valid.message);
        assert.equal(behavior.visible.ok, true);
        assert.equal(behavior.hidden.ok, false);
        assert.equal(behavior.infinite.ok, false);
      },
    );
    console.log(`${checks} layout and learning-runtime checks passed.`);
  } else {
    if (!layoutOnly) {
      await evaluate(
        `localStorage.setItem('escape-exe-save-v1',JSON.stringify({version:3,shards:200,owned:{byte:1,sol:1,query:1,echo:1},party:['byte','sol','query','echo'],completed:{sql:[],python:[],java:[]},ascensions:{}}));location.reload()`,
      );
      await pause(700);
      for (let i = 0; i < 100; i++) {
        if (
          await evaluate('document.querySelectorAll(".world-card").length===3')
        )
          break;
        await pause(50);
      }
      await click('[data-page="party"]');
      const solCard = await evaluate(
        'document.querySelector("[data-character=sol]").textContent',
      );
      check("legendary skill and individual stats are visible in party", () => {
        assert.match(solCard, /Dawn Protocol/);
        assert.match(solCard, /HP 190/);
        assert.match(solCard, /35%/);
      });
      await click('[data-page="worlds"]');
      await click(".world-card button");
      await send("Emulation.setEmulatedMedia", {
        features: [{ name: "prefers-reduced-motion", value: "reduce" }],
      });
      await evaluate(
        "new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))",
      );
      await evaluate(
        `(async()=>{document.querySelector('#code').value='wrong';for(let i=0;i<9;i++){document.querySelector('#cast').click();while(document.body.getAttribute('aria-busy')==='true')await new Promise(resolve=>setTimeout(resolve,15));await new Promise(resolve=>setTimeout(resolve,80));}})()`,
      );
      assert.equal(
        await evaluate(
          'document.querySelector("[data-unit=byte] progress").value',
        ),
        0,
      );
      await evaluate(
        `document.querySelector('#code').value=${JSON.stringify(campaigns[0].stages[0].exercises[0].solution)};document.querySelector('#run').click()`,
      );
      const beforeCast = await evaluate(
        'document.querySelector("[data-unit=byte] progress").value',
      );
      check("safe Run Code cannot activate legendary revival", () =>
        assert.equal(beforeCast, 0),
      );
      await click("#cast");
      await pause(150);
      const revival = await evaluate(
        '({hp:document.querySelector("[data-unit=byte] progress").value,log:document.querySelector("#combat-log").textContent,progress:document.querySelector("#exercise-progress").textContent})',
      );
      check("Lesson casts do not activate Sol automatically", () => {
        assert.equal(revival.hp, 0);
        assert.equal(revival.log, "Your party strikes.");
        assert.match(revival.progress, /Example 2/);
      });
      await evaluate(
        `(async()=>{document.querySelector('#code').value='wrong';for(let i=0;i<15 && document.querySelector('[data-unit=byte] progress').value>0;i++){document.querySelector('#cast').click();while(document.body.getAttribute('aria-busy')==='true')await new Promise(resolve=>setTimeout(resolve,15));await new Promise(resolve=>setTimeout(resolve,80));}})()`,
      );
      await evaluate(
        `document.querySelector('#code').value=${JSON.stringify(campaigns[0].stages[0].exercises[1].solution)};document.querySelector('#cast').click()`,
      );
      await pause(150);
      const secondRevival = await evaluate(
        'document.querySelector("[data-unit=byte] progress").value',
      );
      check("Sol cannot revive a second time in the same attempt", () =>
        assert.equal(secondRevival, 0),
      );
      await click('[data-page="worlds"]');
    }
    if (!layoutOnly) {
      await evaluate(
        `localStorage.setItem('escape-exe-save-v1',JSON.stringify({version:3,shards:200,owned:{byte:10,patch:1,query:1,echo:1},party:['byte','patch','query','echo'],completed:{sql:[0,1],python:[],java:[]},ascensions:{}}));location.reload()`,
      );
      await pause(700);
      for (let i = 0; i < 100; i++) {
        if (
          await evaluate('document.querySelectorAll(".world-card").length===3')
        )
          break;
        await pause(50);
      }
      await click('[data-page="party"]');
      for (let i = 0; i < 3; i++) await click('[data-ascend="byte"]');
      const ascended = await evaluate(
        '({save:JSON.parse(localStorage.getItem("escape-exe-save-v1")),text:document.querySelector("[data-character=byte]").textContent,disabled:document.querySelector("[data-ascend=byte]").disabled})',
      );
      check(
        "ascend buttons spend escalating duplicates and cap at three",
        () => {
          assert.equal(ascended.save.ascensions.byte, 3);
          assert.equal(ascended.disabled, true);
          assert.match(ascended.text, /Spare duplicates: 0/);
        },
      );
      await click('[data-page="worlds"]');
      await click(".world-card button");
      await click("#stage-map button");
      const health = () =>
        evaluate(
          'Array.from(document.querySelectorAll("#battle-party progress:not(.skill-charge)"),bar=>bar.value)',
        );
      const initialHealth = await health();
      await evaluate(
        'document.querySelector("#code").value="wrong";document.querySelector("#code").dispatchEvent(new Event("input"));document.querySelector("#run").click()',
      );
      const practiceHealth = await health();
      check("Run Code errors never trigger retaliation", () =>
        assert.deepEqual(practiceHealth, initialHealth),
      );
      await click("#cast");
      await pause(550);
      const tankHit = await health();
      check("failed cast damages only the tank", () => {
        assert.ok(tankHit[0] < initialHealth[0]);
        assert.deepEqual(tankHit.slice(1), initialHealth.slice(1));
      });
      await evaluate(
        'document.querySelectorAll("#stage-map button")[2].click()',
      );
      const beforeAoe = await health();
      await evaluate(
        'document.querySelector("#code").value="wrong";document.querySelector("#code").dispatchEvent(new Event("input"));document.querySelector("#cast").click()',
      );
      await pause(550);
      const afterAoe = await health();
      check("AoE failed cast damages all four party members", () =>
        assert.ok(afterAoe.every((hp, index) => hp < beforeAoe[index])),
      );
      await send("Emulation.setEmulatedMedia", {
        features: [{ name: "prefers-reduced-motion", value: "reduce" }],
      });
      await evaluate(
        "new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))",
      );
      await evaluate(
        `(async()=>{for(let i=0;i<30 && document.querySelector('#retry-battle').hidden;i++){document.querySelector('#cast').click();while(document.body.getAttribute('aria-busy')==='true')await new Promise(resolve=>setTimeout(resolve,15));await new Promise(resolve=>setTimeout(resolve,80));}})()`,
      );
      const fallen = await evaluate(
        '({retry:!document.querySelector("#retry-battle").hidden,cast:document.querySelector("#cast").disabled})',
      );
      check("party defeat exposes free retry and stops casts", () => {
        assert.equal(fallen.retry, true);
        assert.equal(fallen.cast, true);
      });
      await click("#retry-battle");
      const retryHealth = await health();
      const draft = await evaluate('document.querySelector("#code").value');
      check("free retry restores HP and keeps draft", () => {
        assert.deepEqual(retryHealth, beforeAoe);
        assert.equal(draft, "wrong");
      });
      await click('[data-page="worlds"]');
    }
    if (!layoutOnly && !process.argv.includes("--combat-only")) {
      // Seed a legacy save to verify migration and deterministic summon outcomes.
      await evaluate(
        `localStorage.setItem('escape-exe-save-v1', JSON.stringify({version:1,gems:300,owned:{byte:1,patch:1,query:1,echo:1},party:['byte','patch','query','echo'],completed:{sql:[],python:[],java:[]}}));location.reload()`,
      );
      await pause(700);
      for (let i = 0; i < 100; i++) {
        if (
          await evaluate('document.querySelectorAll(".world-card").length===3')
        )
          break;
        await pause(100);
      }
      const migratedBalance = await evaluate(
        'document.querySelector("#shards").textContent',
      );
      check("legacy wallet migrates in browser", () =>
        assert.equal(migratedBalance, "300"),
      );
      await send("Emulation.setEmulatedMedia", {
        features: [{ name: "prefers-reduced-motion", value: "no-preference" }],
      });
      await click('[data-page="reconstruction"]');
      const charging = await evaluate(
        `(() => {window.originalRandom=Math.random;Math.random=()=>0;document.querySelector('#summon').click();document.querySelector('#summon').click();return {shards:document.querySelector('#shards').textContent,busy:document.querySelector('#summon-chamber').getAttribute('aria-busy'),animated:document.querySelector('#summon-chamber').classList.contains('reconstructing'),reduced:matchMedia('(prefers-reduced-motion: reduce)').matches,paused:document.querySelector('#motion').getAttribute('aria-pressed')};})()`,
      );
      check("double click charges once and starts reconstruction", () => {
        assert.equal(charging.shards, "200");
        assert.equal(charging.busy, "true");
        assert.equal(charging.animated, true);
      });
      await click("#skip-summon");
      const duplicateMessage = await evaluate(
        'document.querySelector("#summon-message").textContent',
      );
      check("duplicate reveal clearly reports saved copies", () =>
        assert.match(duplicateMessage, /2 copies/),
      );
      await pause(450);
      await evaluate(
        'let draws=[0.9,0];Math.random=()=>draws.shift()??0;document.querySelector("#summon").click()',
      );
      await pause(1800);
      const reveal = await evaluate(
        '({name:document.querySelector("#summon-result h3").textContent,balance:document.querySelector("#shards").textContent,busy:document.querySelector("#summon-chamber").getAttribute("aria-busy")})',
      );
      check("animated new companion reveal spends 100 shards", () => {
        assert.equal(reveal.name, "Nova");
        assert.equal(reveal.balance, "100");
        assert.equal(reveal.busy, "false");
      });
      const summonImage = await send("Page.captureScreenshot", {
        format: "png",
      });
      await writeFile(
        resolve(root, ".tools", "summon-reveal.png"),
        Buffer.from(summonImage.data, "base64"),
      );
      await click("#summon-party");
      await click('[data-slot="2"]');
      await click('[data-character="nova"] button');
      const partySave = await evaluate(
        'JSON.parse(localStorage.getItem("escape-exe-save-v1"))',
      );
      check("party slot replacement is saved with four unique members", () => {
        assert.deepEqual(partySave.party, ["byte", "patch", "nova", "echo"]);
        assert.equal(partySave.owned.byte, 2);
        assert.equal(partySave.shards, 100);
      });
      await evaluate("Math.random=window.originalRandom;location.reload()");
      await pause(700);
      for (let i = 0; i < 100; i++) {
        if (
          await evaluate('document.querySelectorAll(".world-card").length===3')
        )
          break;
        await pause(100);
      }
      await click('[data-page="party"]');
      const retained = await evaluate(
        `document.querySelector('[data-slot="2"]').textContent`,
      );
      check("party survives browser reload", () =>
        assert.match(retained, /Nova/),
      );
      await click('[data-page="reconstruction"]');
      await evaluate(
        'Math.random=()=>0;document.querySelector("#summon").click()',
      );
      await click('[data-page="party"]');
      await click('[data-page="reconstruction"]');
      const completed = await evaluate(
        '({disabled:document.querySelector("#summon").disabled,busy:document.querySelector("#summon-chamber").getAttribute("aria-busy"),text:document.querySelector("#summon-message").textContent})',
      );
      check(
        "leaving reveal keeps result and insufficient balance disables roll",
        () => {
          assert.equal(completed.disabled, true);
          assert.equal(completed.busy, "false");
          assert.match(completed.text, /copies/);
        },
      );
      const text = await evaluate("document.body.textContent");
      check("UI has no corrupted question-mark separators", () =>
        assert.equal(text.includes("?"), false),
      );
      await evaluate("localStorage.clear();location.reload()");
      await pause(700);
      for (let i = 0; i < 100; i++) {
        if (
          await evaluate('document.querySelectorAll(".world-card").length===3')
        )
          break;
        await pause(100);
      }
    }
    if (
      !layoutOnly &&
      !process.argv.includes("--combat-only") &&
      !process.argv.includes("--collection-only")
    ) {
      // Cancelled transitions must not hijack another screen or newly selected stage.
      await click('[data-page="worlds"]');
      await click(".world-card button");
      for (const exercise of campaigns[0].stages[0].exercises) {
        await evaluate(
          `document.querySelector('#code').value=${JSON.stringify(exercise.solution)};document.querySelector('#cast').click()`,
        );
        await pause(900);
      }
      await click('[data-page="party"]');
      await pause(1900);
      const afterCancel = await evaluate("document.body.dataset.page");
      check("leaving during clear cancels automatic navigation", () =>
        assert.equal(afterCancel, "party"),
      );
      for (const [worldIndex, world] of campaigns.entries()) {
        await evaluate("localStorage.clear();location.reload()");
        await pause(700);
        for (let attempt = 0; attempt < 100; attempt++) {
          if (
            await evaluate(
              'document.querySelectorAll(".world-card button").length===3',
            )
          )
            break;
          await pause(100);
        }
        await evaluate(
          `document.querySelectorAll('.world-card button')[${worldIndex}].click()`,
        );
        const opening = await evaluate(
          '({party:JSON.parse(localStorage.getItem("escape-exe-save-v1")).party,owned:JSON.parse(localStorage.getItem("escape-exe-save-v1")).owned,visible:document.querySelectorAll("#battle-party .companion").length})',
        );
        check(`${world.id} begins with only Byte Knight`, () => {
          assert.deepEqual(opening.party, ["byte"]);
          assert.deepEqual(opening.owned, { byte: 1 });
          assert.equal(opening.visible, 1);
        });
        const firstTitle = await evaluate(
          'document.querySelector("#stage-title").textContent',
        );
        check(world.id + " starts first from a fresh save", () =>
          assert.equal(firstTitle, world.stages[0].title),
        );
        for (let index = 0; index < world.stages.length; index++) {
          assert.equal(
            await evaluate(
              'document.querySelector("#stage-title").textContent',
            ),
            world.stages[index].title,
          );
          const before = Number(
            await evaluate('document.querySelector("#shards").textContent'),
          );
          await evaluate(
            `document.querySelector('#code').value='';document.querySelector('#cast').click()`,
          );
          await pause(550);
          const afterInvalid = Number(
            await evaluate('document.querySelector("#shards").textContent'),
          );
          check(world.id + " invalid cast preserves rewards " + index, () =>
            assert.equal(afterInvalid, before),
          );
          assert.equal(
            await evaluate('document.querySelector("#hp").value'),
            world.stages[index].enemy.hp,
          );
          const exercises = world.stages[index].exercises;
          const b = await layout();
          check(world.id + " battle actions fit desktop " + index, () => {
            assert.ok(b.cast.bottom <= b.height);
            assert.ok(b.scrollHeight <= b.height + 1);
          });
          for (const [exerciseIndex, exercise] of exercises.entries()) {
            const hpBefore = await evaluate(
              'document.querySelector("#hp").value',
            );
            await evaluate(
              `document.querySelector('#code').value=${JSON.stringify(exercise.solution)};document.querySelector('#run').click()`,
            );
            assert.equal(
              await evaluate('document.querySelector("#hp").value'),
              hpBefore,
            );
            await click("#cast");
            await pause(exerciseIndex === exercises.length - 1 ? 1950 : 30);
            if (exerciseIndex < exercises.length - 1) {
              const status = await evaluate(
                '({hp:document.querySelector("#hp").value,progress:document.querySelector("#exercise-progress").textContent,shards:document.querySelector("#shards").textContent})',
              );
              check(
                `${world.id} stage ${index + 1} example ${exerciseIndex + 1} cannot finish fight early`,
                () => {
                  assert.ok(status.hp > 0);
                  assert.ok(status.hp < hpBefore);
                  assert.equal(Number(status.shards), before);
                  assert.match(
                    status.progress,
                    new RegExp(
                      `Example ${exerciseIndex + 2} / ${exercises.length}`,
                    ),
                  );
                },
              );
            }
          }
          if (index < world.stages.length - 1)
            assert.equal(
              await evaluate(
                'document.querySelector("#stage-title").textContent',
              ),
              world.stages[index + 1].title,
            );
          else
            assert.equal(
              await evaluate("document.body.dataset.page"),
              "worlds",
            );
          const recruitedParty = await evaluate(
            'JSON.parse(localStorage.getItem("escape-exe-save-v1")).party',
          );
          check(
            `${world.id} stage ${index + 1} recruits the right guaranteed companion`,
            () =>
              assert.deepEqual(
                recruitedParty,
                ["byte", "patch", "echo", "pip"].slice(
                  0,
                  Math.min(index + 2, 4),
                ),
              ),
          );
          const afterReward = Number(
            await evaluate('document.querySelector("#shards").textContent'),
          );
          check(
            world.id + " clear awards once and auto advances " + index,
            () =>
              assert.equal(afterReward, before + (index % 4 === 3 ? 60 : 35)),
          );
        }
      }
      for (const [width, height] of [
        [390, 844],
        [844, 390],
      ]) {
        await send("Emulation.setDeviceMetricsOverride", {
          width,
          height,
          deviceScaleFactor: 1,
          mobile: true,
        });
        await click('[data-page="worlds"]');
        await click(".world-card button");
        const b = await layout();
        check("mobile no horizontal overflow " + width + "x" + height, () =>
          assert.ok(b.scrollWidth <= width),
        );
      }
    }
    for (const [width, height] of [
      [390, 844],
      [844, 390],
    ]) {
      await send("Emulation.setDeviceMetricsOverride", {
        width,
        height,
        deviceScaleFactor: 1,
        mobile: true,
      });
      for (const page of ["reconstruction", "party"]) {
        await click(`[data-page="${page}"]`);
        const bounds = await layout();
        check(`${page} fits mobile width ${width}`, () =>
          assert.ok(bounds.scrollWidth <= width),
        );
      }
    }
    await send("Emulation.setEmulatedMedia", {
      features: [{ name: "prefers-reduced-motion", value: "reduce" }],
    });
    await evaluate(
      "new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))",
    );
    await click('[data-page="worlds"]');
    await pause(150);
    const animationState = await evaluate(
      "({ reduced:matchMedia('(prefers-reduced-motion: reduce)').matches, animations:document.getAnimations().map(a=>({state:a.playState,target:a.effect.target.tagName,name:a.animationName,transition:a.transitionProperty}))})",
    );
    const animationCount = animationState.animations.length;
    check("reduced motion skips transition animations", () =>
      assert.equal(animationCount, 0),
    );
    if (!layoutOnly && !process.argv.includes("--combat-only")) {
      await click('[data-page="reconstruction"]');
      const instant = await evaluate(
        `(() => { const before=Number(document.querySelector('#shards').textContent);document.querySelector('#summon').click();document.querySelector('#summon').click();return {before,after:Number(document.querySelector('#shards').textContent),busy:document.querySelector('#summon-chamber').getAttribute('aria-busy'),result:document.querySelector('#summon-result').textContent}; })()`,
      );
      check(
        "reduced motion reveals immediately and guards rapid repeat clicks",
        () => {
          assert.equal(instant.after, instant.before - 100);
          assert.equal(instant.busy, "false");
          assert.ok(instant.result.length > 0);
        },
      );
    }
    if (!layoutOnly && !process.argv.includes("--combat-only")) {
      await send("Page.navigate", { url: url.split("?")[0] });
      await pause(700);
      for (let i = 0; i < 100; i++) {
        if (
          await evaluate('document.querySelectorAll(".world-card").length===3')
        )
          break;
        await pause(50);
      }
      await click('[data-page="reconstruction"]');
      const beforeCopies = await evaluate(
        'Object.values(JSON.parse(localStorage.getItem("escape-exe-save-v1")).owned).reduce((sum,n)=>sum+n,0)',
      );
      await click("#summon-five");
      const batch = await evaluate(
        '({cards:document.querySelectorAll("#summon-result .summon-card").length,wallet:document.querySelector("#shards").textContent,copies:Object.values(JSON.parse(localStorage.getItem("escape-exe-save-v1")).owned).reduce((sum,n)=>sum+n,0)})',
      );
      check(
        "unlimited five-pull reveals and saves all five random results",
        () => {
          assert.equal(batch.cards, 5);
          assert.equal(batch.wallet, "Unlimited");
          assert.equal(batch.copies, beforeCopies + 5);
        },
      );
      for (const [width, height] of [
        [1280, 720],
        [390, 844],
      ]) {
        await send("Emulation.setDeviceMetricsOverride", {
          width,
          height,
          deviceScaleFactor: 1,
          mobile: width < 1024,
        });
        const bounds = await layout();
        check(`five-pull results fit width ${width}`, () =>
          assert.ok(bounds.scrollWidth <= width),
        );
      }
    }
    console.log(`${checks} browser checks passed.`);
  }
} finally {
  if (ws?.readyState === WebSocket.OPEN && send) {
    try {
      await Promise.race([send("Browser.close"), pause(1500)]);
    } catch {}
  }
  ws?.close();
  edge.kill();
  server.closeAllConnections();
  await new Promise((resolve) => server.close(resolve));
}
