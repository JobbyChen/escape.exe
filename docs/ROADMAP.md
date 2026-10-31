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
- [x] Four-unit teams, 12 characters, summon odds and earnable Byte Gems.
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
