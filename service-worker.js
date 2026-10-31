const CACHE = "escape-exe-v15";
const FILES = [
  "./scripts/skill-charge.js",
  "./scripts/skill-prompts.js",
  "./scripts/behavior-grading.js",
  "./scripts/curriculum/stage-builder.js",
  "./scripts/curriculum/programming-problems.js",
  "./scripts/curriculum/sql-problems.js",
  "./scripts/runners/python-worker.js",
  "./scripts/runners/java-worker.js",
  "./scripts/runners/java-subset.js",
  "./scripts/runners/sql-worker.js",
  "./vendor/sql-wasm.js",
  "./vendor/sql-wasm.wasm",
  "./vendor/python/pyodide.js",
  "./vendor/python/pyodide.asm.js",
  "./vendor/python/pyodide.asm.wasm",
  "./vendor/python/python_stdlib.zip",
  "./vendor/python/pyodide-lock.json",

  "./",
  "./index.html",
  "./styles/game.css",
  "./scripts/game.js",
  "./scripts/combat.js",
  "./scripts/characters.js",
  "./scripts/character-skills.js",
  "./scripts/campaigns.js",
  "./scripts/lesson-exercises.js",
  "./scripts/save-data.js",
  "./scripts/code-checks.js",
  "./scripts/pixel-art.js",
  "./manifest.webmanifest",
  "./assets/icon.svg",
];
self.addEventListener("install", (event) =>
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(FILES))),
);
self.addEventListener("activate", (event) =>
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("escape-exe-") && key !== CACHE)
            .map((key) => caches.delete(key)),
        ),
      ),
  ),
);
self.addEventListener("fetch", (event) => {
  if (
    event.request.method !== "GET" ||
    new URL(event.request.url).origin !== location.origin
  )
    return;
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request)),
  );
});
