# ESCAPE.EXE — Development Roadmap

**Status:** Planning guide, updated 2026-10-31. Milestones are ordered by dependency, **not** promised release dates. Work in short, playable increments; never sacrifice educational accuracy to inflate stage counts.

## North star

Deliver three independently completable, high-quality coding campaigns with reliable execution and testing, a compelling original digital-world narrative, and collectible strategy that rewards learning rather than luck.

## Baseline: Alpha 0.1 (already in repository)

- [x] Hub plus independent SQL/Python/Java map entry points.
- [x] Four playable stages per campaign (12 total), including two-phase boss scenarios.
- [x] Mobile portrait/landscape-responsive battle layouts.
- [x] Basic Run Code / Cast Spell flow.
- [x] Small read-only SQL subset evaluation, limited Python/Java pattern checks.
- [x] Four-unit teams, 12 characters, summon odds and earnable Core Shards.
- [x] Save basic progress, gems, collection and journal locally in the browser.
- [ ] Real SQL engine, Python sandbox, Java sandbox, full story and full chapter curricula — **not in alpha**.

## Milestone 0 — Stabilize and specify the existing prototype

**Goal:** A repo others can clone, run, test and extend safely.

- [ ] Refactor `game.js` into distinct modules: content, state, combat, validation and UI without changing player behavior.
- [ ] Introduce versioned save schema with migration and defensive loading.
- [ ] Add automated checks for independent map unlocks, team size, one-time first-clear rewards, summons, Run/Cast and save continuity.
- [ ] Add accessible keyboard focus, announcement and reduced-motion checks.
- [ ] Test code editor/input on real iPhone and Android devices (soft keyboard, portrait/landscape orientation and zoom).
- [ ] Create a canonical stage schema and authoring format.

**Acceptance:** New contributors can run tests and complete the existing 12 stages with no critical data loss or navigation regressions.

## Milestone 1 — Build a credible SQL vertical slice (highest educational priority)

**Goal:** One small, polished chapter where **real SQL** rather than pattern recognition powers combat.

- [ ] Replace the homegrown SQL regex interpreter with an isolated SQLite engine (browser WASM or safe server implementation).
- [ ] Load per-stage, resettable database fixtures; disallow unintended table access or destructive statements in SELECT-only challenges.
- [ ] Add visible examples + hidden/alternate fixtures; validate resulting rows including ordering only when required.
- [ ] Write and review 8–10 Chapter 1 stages with concepts, hints, explanatory feedback and review.
- [ ] Implement multi-phase chapter boss with truly mixed skills.
- [ ] Create testable class abilities (tank, healer, DPS, support), enemy retaliation, HP and clear combat logs.
- [ ] Teach what `SELECT` and `FROM` actually mean; include transfer tasks rather than syntax memorization alone.
- [ ] Add beginner pre/post mini-assessment and a journal/mastery display.

**Acceptance:** A beginner can start SQL with no prior knowledge, write several distinct correct queries, debug common mistakes, defeat a boss, and explain the taught concepts. Equivalent correct SQL queries pass. Starter characters are sufficient.

## Milestone 2 — Build reliable language runtime infrastructure

**Goal:** Secure, behavior-based code execution for Python and Java.

- [ ] Design ephemeral, isolated runners or appropriately constrained browser runtimes.
- [ ] Set CPU time, wall-clock time, memory, disk, output and process limits; block unsolicited network access.
- [ ] Add language-appropriate compilation/runtime error reporting, timeouts and safe cleanup.
- [ ] Implement per-stage public samples and authoritative hidden tests, supporting alternative correct solutions.
- [ ] Use consistent result contract for all languages: status, diagnostics, visible output, objective checks and error classification.
- [ ] Test malicious inputs, infinite loops, huge output, runtime exceptions and legitimate diverse solutions.

**Acceptance:** Working Python and Java exercises execute *actual code* in a constrained environment with tests showing isolation and correct output/behavior validation. No customer/user code can access host secrets.

## Milestone 3 — Complete Chapter 1 of each independent campaign

**Goal:** New players can choose any language and receive a comparable, complete introductory experience.

- [ ] Write 8–10 introductory SQL stages, Python stages and Java stages with reviewed pedagogical sequencing.
- [ ] Ensure Java teaches real full-program context and clarifies any editor-provided scaffolding.
- [ ] Provide campaign-appropriate tutorial NPCs, unique enemies and boss introduction.
- [ ] Track per-language mastery independently and save/reopen drafts.
- [ ] Test any-language-first onboarding from a fresh account/device.

**Acceptance:** All three first chapters are fun, functioning and independently accessible; no inter-campaign unlock dependencies.

## Milestone 4 — Complete base curriculum and individual endings

**Goal:** Nine fully reviewed core chapters *per language*, progressively shipped one world/chapter at a time.

- [ ] SQL Chapters 2–9 with database queries, writes, relational tasks, analytics and capstone.
- [ ] Python Chapters 2–9 with functions, data structures, files, algorithms, packages/APIs, testing and capstone.
- [ ] Java Chapters 2–9 with OOP, collections, files, tests, core algorithms/concurrency concepts and capstone.
- [ ] Implement mixed review and skill-retention assessment across chapters.
- [ ] Deliver one independent complete ending for each restored core; add optional cross-world lore.
- [ ] Run pedagogical, accessibility and security reviews for all critical flows.

**Acceptance:** A new learner can complete *just one* campaign through its final capstone and ending, with real execution and assessed independent work. No stage is labeled complete unless tested.

## Milestone 5 — Polish the game layer

**Goal:** Better game feel without distorting educational outcomes.

- [ ] Original character sprites, summon effects, enemy states, attack telegraphs and readable combat feedback.
- [ ] Meaningful team synergy and concept-specific abilities, balanced for free starter rosters.
- [ ] Code Evolution triggered by mastery evidence, with no rarity gating.
- [ ] Tune loot distribution, transparent guarantees if introduced, duplicate handling and reward pacing.
- [ ] Implement journal recaps, optional accessibility controls, sound settings and animation skip.
- [ ] Improve responsive code editor; consider offline-friendly PWA.

**Acceptance:** Players can describe how code affected combat; party choice matters but doesn't override skill. The game remains friendly for code novices and mobile users.

## Suggested first GitHub issues (small, testable)

1. **[P0]** Make test runner portable; add `npm`-free documented smoke tests for the current vanilla-JS app.
2. **[P0]** Extract data/content into per-world data files with no progression change.
3. **[P0]** Add independent campaign regression tests (new save → start Java directly; Python directly; SQL directly).
4. **[P1]** Create stage-content JSON schema and validator for structured lesson authoring.
5. **[P1]** Spike SQLite/WASM in a standalone branch; prove alternate correct queries pass.
6. **[P1]** Add deterministic combat calculations and unit tests.
7. **[P1]** Mobile code-editor test: visible Run/Cast while on-screen keyboard is shown.
8. **[P1]** Replace the SQL first boss with a truly multi-concept task using real datasets.

## Definition of done (every issue / PR)

- Implementation satisfies stated user/learning objective.
- Existing campaign independence and free-play invariant intact.
- Automated tests or meaningful manual verification included.
- Edge cases and alternative correct solutions considered.
- Desktop and phone usability checked as applicable.
- User-facing content and accessibility reviewed.
- Docs/status clearly distinguish existing behavior from planned features.

## Known decisions still to make

Hosting/runtime strategy; account system; content authoring tools; exact combat damage formula; animation and music style; user age and parental settings; optional PWA; privacy policy before accounts or analytics; final product name and licensing. Avoid building integrations or paid systems before these choices are made.


## Checkout note ? 2026-10-31

The checkout began with README.md only. A new modular, mobile-friendly 12-stage prototype now exists. Historical alpha references above are not verified prior files. Current limits: no XP, full runtimes, unique unit abilities, mastery assessment, or complete story endings. See README for exact behavior.


## Reconstruction and party update ? 2026-10-31

Implemented: a separate reconstruction screen, skippable motion-aware summon reveal, visible duplicate copy counts, four-slot party assignment, transactional summon rules and version 1-to-2 currency migration. Core Shards replace the currency name; rewards remain 35 per first normal clear and 60 per boss. Real-device testing and duplicate upgrade mechanics remain planned.


Five-pull update: Summon now offers five independent random rolls with the same per-pull odds and no rarity guarantee. Normal price is 500 Core Shards, checked before any roll is charged. Unlimited testing currency also covers five-pulls. Every duplicate copy is saved before the shared skippable reveal.


## Ascension and failed-cast retaliation ? 2026-10-31

User-approved design revision: failed Cast Spell validation now triggers an enemy attack. This supersedes the older rule that invalid casts never cause retaliation. Run Code remains safe and untimed; retries are free. Current limited validators may reject unsupported valid programs, and that limitation remains visible. No rare unit or ascension is required to win.

Ascension costs are 1, then 3, then 5 **additional** duplicates, capped at three stars (9 duplicates total). Each star adds 20% of base HP, ATK and DEF. Base tank stats: 180 HP / 16 ATK / 12 DEF; healer/support: 100 / 14 / 5; other roles: 110 / 24 / 4. `owned` stores lifetime copies, and spent duplicates are derived from saved stars. Schema 3 migrates versions 1/2 with zero stars and rejects impossible ascensions.

Enemy attack is 36 on normal stages, 44 on bosses. Stages 1/2 use single-target attacks; stage 3 and bosses use AoE. Single attacks choose the first living tank, otherwise the first survivor. Damage is max(1, attack - defense), clamped to remaining HP. AoE resolves once per living member. Health lasts through both boss seals; each stage entry restores health. If everyone falls, Retry restores party HP while retaining the current seal, draft and all earned progress. Distinct healer powers and richer encounter balance remain future work.


## Multi-example battle balance update ? 2026-10-31

Current user-approved balance supersedes the older one-cast normal stages, two-seal bosses and 100-code-power formula: every normal stage has 3 distinct practice examples and 180 monster HP; every boss has 4 mixed examples and 240 HP. This applies independently to SQL, Python and Java. The first SQL slime requires SELECT * from enemies, supplies and signals. There are 39 authored examples across the current 12-stage slice, not 39 additional stages or a complete chapter curriculum.

Each solved example resolves 20 baseline basic damage, 40 attack-spell damage and 40 utility points. Utility heals living injured allies before splitting leftover points into shields, which absorb retaliation after defense. This is a 20/40/40 combat-value budget; utility is not extra damage. Ascension scales basic damage up to 25; 2 maximum-power turns cannot defeat 180 HP, and 3 cannot defeat 240 HP. Stage reward and progression require all example objectives. Enemies retaliate only on invalid Cast Spell attempts, with normal ATK 32 and boss ATK 38; Run Code is safe. The starter party can clear everything without rare characters or ascension.

Each authored example includes an objective, visible input/fixture, expected observable result, supported alternatives, edge cases, tiered hints, combat effect and practice-only mastery signal. Normal-stage prerequisites are earlier stages in the same campaign; examples within a stage build in order. SQL retains the same deliberately limited SELECT-only query shapes, parameterized for visible table fixtures; Python/Java remain non-executing pattern demos. Do not call these robust runtimes or mastery assessments. Draft keys now allow example indices 0?3; old saves remain readable. Health retry preserves the current example and enemy HP, with no duplicate rewards. Closing or re-entering a stage restarts its examples.


## Individual character skills ? 2026-10-31

All 12 companions now have individual base HP/ATK/DEF and distinct implemented skills. Roster definitions live in scripts/characters.js, successful-cast activation in scripts/character-skills.js, and damage/utility/guard resolution in scripts/combat.js. This supersedes older descriptive-only character-role wording. See docs/CHARACTER_GUIDE.md for the complete stat and skill table.

Sol's legendary Dawn Protocol adds up to 16 healing/shielding points per correct cast and revives the first fallen ally to 35% max HP once per stage attempt. Sol must be alive. Revived allies can fight immediately but do not activate another skill until the next correct cast. Retry and stage entry reset per-attempt skill counters, marks, guard charges and revive allowance; changing examples does not reset them. No persisted save migration is needed because these are encounter-local fields.

The baseline 20 basic / 40 attack spell / 40 utility budget remains. Team caps are 25 basic damage, 50 total attack-spell damage, and +24 utility points per correct cast. Revive HP is an explicitly separate legendary effect. Basic damage scales with living-party ATK relative to the original starter team's 78 ATK, with a floor of 20 to preserve learning-first balance. Utility prioritizes bonus healing, character-directed shields, base healing, then evenly split remaining shields. Byte and Pip route existing utility rather than minting extra points. Guard charges mitigate one matching enemy retaliation after defense and before shields, never stack, and require the source to remain alive. Combined guard effects are allowed; incoming damage has a minimum of one before shielding.

The strongest possible turn deals 75 damage, so 180/240 HP still requires all 3/4 distinct examples. Starter characters remain sufficient. Rarity improves stats, utility and tactical options without becoming a curriculum prerequisite. No skill grants stage credit for wrong code, and Run Code remains safe.


## Gradual starter party update ? 2026-10-31

The user clarified that the milestones are **Stages 2, 3 and 4 of the current chapter**, not future chapters. New saves begin with only Byte Knight. Patch joins when Stage 2 unlocks (clear Stage 1), Echo when Stage 3 unlocks (clear Stage 2), and Pip when Stage 4 unlocks (clear Stage 3). All four are Common. The complete free party is ready for the boss; Query Mage is Rare and is no longer a fresh-save starter.

Any independently chosen campaign can trigger these shared recruits. Grants are one-time globally, require contiguous stage clears within a single campaign, never charge currency or require summons, and never generate duplicate copies for an already-owned recruit. Auto-fill unoccupied party slots on recruitment; never replace an existing chosen full team. New-game empty slots are reserved for story arrivals, while summoned reserves can replace occupied slots.

Schema 4 keeps the stable storage key, supports party lengths 1?4 and persists claimed story recruits. Versions 1?3 migrate without removing existing collection, ascensions, shards, drafts or party; eligible recruits are reconciled on load. Byte alone remains sufficient for the introductory encounters under the learning-first damage floor and free retry rules. This supersedes earlier references to four freely granted starting companions. Actual later chapters remain planned.


## Learning foundation update ? 2026-10-31

Current implementation supersedes older four-stage/pattern-check descriptions: each route now contains 16 stages across four compact chapters (48 stages / 156 combat examples total). New authored problems use explicit contracts, constraints, sample and transfer cases, tiered hints and progressively longer solutions. Topics cover branching, loops, functions, collections/strings and introductory algorithms; SQL adds aggregates, joins, CTEs and window queries. See docs/LEARNING_PLAN.md for the implemented topic map, reviewed resources and missing comprehensive coverage.

SQL uses real read-only SQLite in disposable browser workers, and Python uses real CPython via a constrained Pyodide worker sandbox. Java uses a bounded AST teaching interpreter with behavioral grading, not compilation/JVM execution. The old text-pattern checks are no longer the live game grader. Unsupported forms and runtime-loading failures do not trigger enemy damage. Run Code checks visible samples; Cast Spell adds transfer tests. All code runs locally in the browser, with documented limits; do not claim production sandbox security or full language support.

Old saved stage clears 0?3 are retained; stage/draft validation now supports 0?15, chapter maps unlock independently, and boss rewards occur every fourth stage. Shared starter recruitment remains at Stage 2/3/4. The nine-chapter full-release curriculum and independent endings remain future work; four compact foundation chapters do not constitute comprehensive language completion. Questions are original, informed by the requested Bro Code Java reference and Helsinki Python MOOC, not copied course exercises.
