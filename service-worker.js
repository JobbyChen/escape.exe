const CACHE = "escape-exe-v2";
const FILES = [
  "./",
  "./index.html",
  "./styles/game.css",
  "./scripts/game.js",
  "./scripts/campaigns.js",
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
