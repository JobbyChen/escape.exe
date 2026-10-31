# ESCAPE.EXE

A pixel-art coding RPG for desktop and mobile browsers. Restore The System through three independent SQL, Python and Java practice campaigns.

## Run the game

No dependency installation or build step is needed:

```sh
python -m http.server 8000
```

Open http://localhost:8000. Use a server rather than double-clicking index.html: this game uses JavaScript modules.

For a phone on the same trusted Wi-Fi, use http://YOUR-COMPUTER-LAN-IP:8000 while the server runs. Your firewall must permit the connection. Offline caching requires HTTPS or localhost. Mobile browser Add to Home Screen support varies. This is a mobile-friendly web game, not an App Store or Google Play application.

## Playable features

- Three immediately available campaigns, each with three lessons and a two-phase boss.
- Original canvas pixel art, animated companions and a code-powered battle payoff.
- Separate Run Code and Cast Spell buttons; no coding timer or error penalties.
- Four starter companions, 12 collectible characters and free earned-byte summons with visible odds.
- Four-member party selection, one-time rewards, independent progress and a practice journal.
- Versioned local saves and code drafts, keyboard focus, reduced motion and animation toggle.
- Right-hand desktop navigation and a viewport-sized desktop shell without page scrolling.
- Automatic stage advancement after a brief clear result; bosses return to campaigns. Leaving the screen cancels a pending transition.
- Battle impact, party attack and screen entrance animations; reduced motion and Pause animation suppress them.
- Portrait layout that collapses the battlefield when editing, and landscape support.
- Offline app files after a successful first visit on HTTPS or localhost.

## Honest prototype limits

SQL is a small read-only SELECT subset over the visible dataset, not SQLite. There are no hidden fixtures. Python and Java use anchored practice pattern checks, **not execution or compilation**. Many valid programs are unsupported. Java input represents statements inside main; stage 1 shows the full program wrapper. Player source never goes to eval, a shell or a host runtime.

Combat is a visual code-powered payoff. Character roles are descriptive: unique abilities, enemy retaliation, XP, full curricula, mastery assessments and complete story endings are planned. Duplicates are tracked but do not upgrade characters. There are no payments, accounts, analytics or cloud saves. Clearing browser storage removes progress.

## Human-readable project layout

```text
index.html                 Game screens and accessible controls
styles/game.css            Colors, layout, desktop and phone styles
scripts/campaigns.js        Lessons, datasets and character roster
scripts/code-checks.js      Clearly limited practice validators
scripts/save-data.js        Save loading, rewards and summon rules
scripts/pixel-art.js        Original pixel scenery and characters
scripts/game.js             Navigation, editor and battle interactions
scripts/run-tests.mjs       Dependency-free behavior tests
scripts/browser-tests.mjs   Headless Edge layout and game-flow tests
assets/icon.svg            Original app icon
manifest.webmanifest       Mobile web app metadata
service-worker.js          Offline app cache
docs/                      Design references and technical plan
```

## Verification

With Node.js installed, run `node scripts/run-tests.mjs`. Check JavaScript syntax with `node --check scripts/game.js`. On Windows with Microsoft Edge installed, run `node scripts/browser-tests.mjs` for local headless browser regression checks. These cover desktop screen fit, right navigation, Run/Cast separation, invalid input, automatic progression in each campaign, cancellation when navigating away, mobile horizontal overflow and reduced motion. The browser test uses an isolated profile inside ignored `.tools/` and requires local loopback networking.

Real iOS/Android soft keyboards, home-screen installation and manual keyboard navigation still require device verification. Longer datasets, output and roster content can scroll within their desktop panels; the desktop page itself stays in the viewport.

## Source documents

The supplied design, roadmap, project instructions and contributor instructions are retained in this repository. Their historical alpha descriptions referenced files absent from this checkout, which originally contained only README.md. This implementation is a new bounded prototype. See the limits above for what actually exists.

Verified in this checkout: 45 behavior checks passed; JavaScript syntax, HTML references, unique element IDs and manifest JSON checks passed. Browser visual and real-device checks were not run. A local Node.js test runtime lives in ignored `.tools/`; it is not a game dependency.
