// Local browser regression checks using installed Edge and Node's built-in CDP transport.
// Run: node scripts/browser-tests.mjs (Windows, Microsoft Edge required).
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir } from "node:fs/promises";
import { spawn } from "node:child_process";
import { resolve, extname } from "node:path";
import { campaigns } from "./campaigns.js";
const root = resolve(import.meta.dirname, "..");
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
    }[extname(path)];
    res.writeHead(200, { "Content-Type": type || "text/plain" }).end(body);
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const url = `http://127.0.0.1:${server.address().port}`;
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
let ws;
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
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const id = ++sequence;
      pending.set(id, { resolve, reject });
      setTimeout(() => {
        if (pending.delete(id)) reject(Error("CDP timeout: " + method));
      }, 8000).unref();
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
    return result.result.value;
  };
  await send("Page.enable");
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
    for (const page of ["party", "journal"]) {
      await click(`[data-page="${page}"]`);
      const b = await layout();
      check(page + " fits desktop " + size.join("x"), () =>
        assert.ok(b.scrollHeight <= b.height + 1),
      );
    }
  }
  // Cancelled transitions must not hijack another screen or newly selected stage.
  await click('[data-page="worlds"]');
  await click(".world-card button");
  await evaluate(
    `document.querySelector('#code').value='SELECT * FROM enemies;';document.querySelector('#cast').click()`,
  );
  await pause(900);
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
    const firstTitle = await evaluate(
      'document.querySelector("#stage-title").textContent',
    );
    check(world.id + " starts first from a fresh save", () =>
      assert.equal(firstTitle, world.stages[0].title),
    );
    for (let index = 0; index < world.stages.length; index++) {
      assert.equal(
        await evaluate('document.querySelector("#stage-title").textContent'),
        world.stages[index].title,
      );
      const before = Number(
        await evaluate('document.querySelector("#gems").textContent'),
      );
      await evaluate(
        `document.querySelector('#code').value='';document.querySelector('#cast').click()`,
      );
      const afterInvalid = Number(
        await evaluate('document.querySelector("#gems").textContent'),
      );
      check(world.id + " invalid cast preserves rewards " + index, () =>
        assert.equal(afterInvalid, before),
      );
      assert.equal(await evaluate('document.querySelector("#hp").value'), 100);
      const solution = world.stages[index].solution;
      await evaluate(
        `document.querySelector('#code').value=${JSON.stringify(solution)};document.querySelector('#run').click()`,
      );
      assert.equal(await evaluate('document.querySelector("#hp").value'), 100);
      const b = await layout();
      check(world.id + " battle actions fit desktop " + index, () => {
        assert.ok(b.cast.bottom <= b.height);
        assert.ok(b.scrollHeight <= b.height + 1);
      });
      await click("#cast");
      if (index === 3) {
        await pause(900);
        assert.equal(await evaluate('document.querySelector("#hp").value'), 50);
        assert.equal(
          await evaluate('document.querySelector("#stage-title").textContent'),
          world.stages[3].title,
        );
        const second = world.stages[world.id === "sql" ? 2 : 1].solution;
        await evaluate(
          `document.querySelector('#code').value=${JSON.stringify(second)};document.querySelector('#cast').click()`,
        );
      }
      await pause(2750);
      if (index < 3)
        assert.equal(
          await evaluate('document.querySelector("#stage-title").textContent'),
          world.stages[index + 1].title,
        );
      else assert.equal(await evaluate("document.body.dataset.page"), "worlds");
      const afterReward = Number(
        await evaluate('document.querySelector("#gems").textContent'),
      );
      check(world.id + " clear awards once and auto advances " + index, () =>
        assert.equal(afterReward, before + (index === 3 ? 60 : 35)),
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
  await send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "reduce" }],
  });
  await click('[data-page="worlds"]');
  const animationCount = await evaluate("document.getAnimations().length");
  check("reduced motion skips transition animations", () =>
    assert.equal(animationCount, 0),
  );
  console.log(`${checks} browser checks passed.`);
} finally {
  ws?.close();
  edge.kill();
  server.closeAllConnections();
  await new Promise((resolve) => server.close(resolve));
}
