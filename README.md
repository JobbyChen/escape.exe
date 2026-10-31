# ESCAPE.EXE

A pixel-art coding RPG for desktop and phone browsers. Choose SQL, Python or Java independently, solve code challenges, and restore The System.

## Run locally

```sh
python -m http.server 8000
```

Open http://localhost:8000. Use a server, not a double-clicked HTML file: the game uses modules, workers and WebAssembly. No package install or build step is required. Browser runtime assets are included in `vendor/` (about 15 MB), so submitted code is not sent to an external execution service.

On a trusted Wi-Fi network, a phone can open http://YOUR-COMPUTER-LAN-IP:8000 if your firewall allows it. Service-worker offline caching and browser installation require HTTPS or localhost. Real-phone keyboard and installation testing remains manual. This is a web game, not an App Store or Google Play release.

## Learning that is playable now

- **16 stages per language**, grouped into four short chapters: 48 stages and 156 combat examples total.
- Earlier questions teach output, variables and simple queries. Later questions require multi-line functions, conditions, loops, array/list scans, string encoding, nested searches, sliding windows, binary search and mixed review.
- SQL progresses into sorting, aggregates, joins, empty-group handling, subqueries, CTEs and window functions.
- Each new problem has a statement, constraints, a function/query contract, visible examples, transfer cases and tiered hints. Difficulty and chapter appear in the interface.
- **Run Code** checks visible cases safely. **Cast Spell** also checks transfer cases before combat. Results are compared by behavior, not a reference source string.
- **Full editor** opens a spacious side-by-side problem/editor workspace on desktop. The default view keeps battle visible; committing a cast returns to that view so attacks and retries remain visible.
- Desktop combat uses compact party status cards and a scrollable combat log to give the battlefield more room.
- Chapter-end reviews combine earlier concepts. Working general solutions carry forward between batches for the same problem; players do not have to retype an identical function simply to advance combat.
- Learning is untimed. Runtime-loading failures and unsupported language forms do not trigger monster retaliation.

See [Learning plan and source references](docs/LEARNING_PLAN.md) for the topic map, rationale and missing coverage. These are foundation/problem-solving chapters, **not complete language courses or evidence of mastery**. There is no affiliation with Bro Code, Helsinki or LeetCode; game problems and solutions are original.

## What actually runs

| Route | Current evaluator | Important boundary |
| --- | --- | --- |
| SQL | SQLite via sql.js, in a disposable browser worker | Read-only disposable fixtures; local row/result and heap limits |
| Python | Real CPython via Pyodide, in a disposable browser worker | Beginner sandbox: functions, loops, collections and selected built-ins; imports, files, classes, private access and some syntax are restricted |
| Java | Bounded Java teaching interpreter executing a parsed AST in a browser worker | **Not a JVM or javac.** Supports the documented integer/Boolean/String/one-dimensional-array/static-method subset; no imports, objects, inheritance or full Java library |

Java starters represent methods inside a supplied `Solution` class, or early statements inside `main`; examples explain the full-program context. Valid Java outside the supported subset can be rejected and is labeled unsupported where detected. A full isolated compiler/JVM is the next Java infrastructure milestone.

Workers are terminated after grading or timeout. Each test gets a fresh Python namespace, Java environment or SQLite database. Limits include source/output sizes, execution steps, bounded collections and a 2.5-second per-case wall budget after runtime readiness; initial runtime load has 45 seconds. SQLite uses a 16 MB allocation ceiling. Browser memory behavior is not an OS/container RAM guarantee, so this local educational runner is not a production multi-tenant judging service. Never run arbitrary player code in a host Python/Java process. Tests and reference solutions are shipped to the browser; they are not secret exam infrastructure.

## Party and combat

New saves start with **Byte Knight only**. Patch joins when Stage 2 unlocks, Echo at Stage 3 and Pip at Stage 4, in whichever language you choose first. Recruitment is shared, free and once-only. Existing saves retain earned collection, party, ascension, drafts and progress.

Normal fights require three examples and have 180 HP; chapter bosses require four and have 240 HP. Baseline correct-code turns provide 20-25 basic damage, 40 attack-spell damage and 40 healing/shield utility. Optional charged skills resolve separately and cannot deliver a finishing blow or replace required lesson examples. Failed committed casts trigger single-target tank-first or AoE retaliation. Free health retry preserves the current example, enemy HP, draft and rewards.

All 12 companions have manual individual skills; see [Character guide](docs/CHARACTER_GUIDE.md). Each living character earns 8 bits per lesson auto-attack. Eight bits equal one Byte; characters need 12-24 bits, with each ascension star reducing the cost by 1 bit. A full charge lights up the character border: click the portrait and solve its character-themed prompt in your campaign language to activate. Run Code is safe practice; Use Skill spends charge only on success. Failed committed skill prompts trigger normal retaliation and preserve charge. Skills do not advance lessons, generate more bits, award shards or land a finishing blow. Charge resets on stage entry or free retry.

Skill explanations and charge costs appear in each character's description in Your party; successful combat messages stay brief. Ascension costs 1, then 3, then 5 additional duplicates, capped at three stars. Each star increases individual base HP/ATK/DEF by 20%.

The Summon tab supports single and five-pull random rolls with explicit duplicate counts. This testing build defaults to unlimited shards. Add `?shards=earned` to use normal costs (100/500) and rewards (35 per first normal clear, 60 per chapter boss). There are no payments, accounts, analytics or cloud saves.

## Human-readable source layout

```text
index.html                          Accessible screens and editor controls
styles/game.css                     Desktop shell and mobile layouts
scripts/campaigns.js                 Campaign metadata and initial chapter
scripts/lesson-exercises.js          Introductory examples
scripts/curriculum/                  Progressive problem statements and test fixtures
scripts/code-checks.js               Live asynchronous grading entry point
scripts/behavior-grading.js          Worker orchestration and result comparison
scripts/runners/                     SQLite, Python and bounded Java execution
scripts/characters.js                Individual character stats and descriptions
scripts/character-skills.js          Correct-cast skill effects
scripts/skill-charge.js              Character bit costs and charge rules
scripts/skill-prompts.js             Character-themed coding prompts
scripts/combat.js                    Damage, healing, shielding and targeting
scripts/save-data.js                 Save validation, rewards and recruitment
scripts/game.js                      Navigation and interactions
scripts/pixel-art.js                 Original pixel artwork
scripts/run-tests.mjs                Dependency-free rule and interpreter checks
scripts/browser-tests.mjs            Browser layout, learning and game-flow checks
scripts/legacy-code-checks.js        Historical regression fixture; unused by the game
vendor/                             Pinned runtime assets, licenses and checksums
docs/                               Design, curriculum and technical documentation
```

## Verification commands

With Node.js installed:

```sh
node scripts/run-tests.mjs
node scripts/browser-tests.mjs --layout-only
node scripts/browser-tests.mjs --learning-only
node scripts/browser-tests.mjs --runtime-smoke
node scripts/browser-tests.mjs --skills-only
node scripts/browser-tests.mjs
```

Browser checks require Windows with Microsoft Edge installed and local loopback networking. They use isolated profiles and artifacts under ignored `.tools/`. `--learning-only` grades all 156 authored examples through their browser runtimes; `--runtime-smoke` checks generalization and nontermination. The full suite plays every campaign from a fresh save and checks progression, recruits, combat, summons and layouts.

Latest manual-skill verification: 128 rule/interpreter checks, 87 manual-skill/layout browser checks and 57 combat regression browser checks passed. All 12 character prompts were graded in SQL, Python and Java at introductory and function/query difficulty. These automated browser checks do not replace testing a physical phone and its keyboard.

Existing schema-4 saves keep their first four clears and can continue into the new chapters. Save validation now accepts stage indices 0 through 15 and up to 12,000 characters per draft. No existing save is automatically reset. Use an incognito window to inspect the new-game opening.
