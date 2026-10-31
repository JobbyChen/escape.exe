# ESCAPE.EXE — Game Design Document (GDD)

**Version:** 0.1 design baseline · **Updated:** 2026-10-31  
**Status:** Vision and requirements; Alpha 0.1 is a small playable proof of concept, not the full game.  
**Genre:** Single-player educational coding RPG / creature-collection gacha / tactical auto-battler  
**Platforms:** Responsive browser (laptop first for code editing, phone portrait supported, optional landscape combat). Future PWA/native wrappers are possibilities, not commitments.  
**Working title:** ESCAPE.EXE (subject to name and trademark review).

## 1. High concept

A programmer becomes trapped inside their computer, in a digital universe called **The System**. Three regions embody three programming languages: **SQL, Python, and Java**. The player chooses **any one** of these independent campaigns, learns that language from first principles through progressively harder coding challenges, summons collectible digital allies, and powers their attacks by writing and debugging **real code**.

**One-sentence pitch:** *Learn to code to fight your way out of the computer.*

**Player fantasy:** I am a programmer rebuilding a broken world; every new skill becomes a power I can use, and every summoned character gives me new ways to battle.

**Inspirations:** The Battle Cats (stages, worlds, collection, approachable strategy) and Puzzle & Dragons (teams, synergies, boss encounters). These are references for high-level gameplay only: **do not copy characters, artwork, UI, names, audio, or distinctive proprietary designs.**

## 2. Non-negotiable pillars

1. **Coding is the game.** Progress comes from writing, understanding, testing, and debugging actual code—not merely answering trivia to unlock combat.
2. **Three independent complete adventures.** SQL, Python, and Java have their own lessons, chapters, progression, story arcs, final bosses, and valid endings. Players never have to clear another language to finish their chosen campaign.
3. **Collectible strategy without pay-to-win.** A four-character party, class roles, tactical abilities, and summons add variety; no required solution, stage, or ending is gated by character rarity, premium currency, or cross-world play.
4. **Educationally fair combat.** Thinking is not a speed test. The coding phase pauses combat; attempts and errors provide feedback without removing earned progress. Hints are accessible.
5. **A coherent fantasy.** The three lands are part of one computer world; NPCs, bosses, environments, terminology, and endings support the central premise.
6. **Accessible across devices.** Keyboard-first on laptop; split-screen combat on mobile portrait; optional landscape arrangement; readable, usable code editor on all supported devices.

## 3. Audience and learning outcomes

**Primary:** Teens and adults learning their first programming language; beginner-to-intermediate learners who want structured practice and game motivation.  
**Secondary:** Learners reviewing a language or exploring another one after finishing a campaign.

**By completing a base campaign, a player should be able to:**
- Read, explain, edit, write, and debug small-to-medium exercises in that language without step-by-step instructions.
- Solve new tasks using combinations of previously learned concepts.
- Complete a practical, independently assessed capstone that uses several concepts.

**Important distinction:** Nine core chapters target practical foundational-to-intermediate competence, **not expert mastery**. Separate, optional advanced modules can deepen the curricula after launch. The content must be reviewed for pedagogical accuracy before labeling the game comprehensive.

### Instructional model

Each new concept uses **explain → worked example → guided attempt → independent task → transfer task → review**. Chapter bosses use mixed objectives rather than simply requiring one predetermined string of code. Keep instructional text concise and context-sensitive; allow replay, review and practice at any time. Use sensible spaced-review opportunities without blocking progress.

## 4. Story bible

### Opening

A programmer investigates an unfamiliar process on their computer. A failed synchronization transfers their consciousness into **The System**, a vast digital civilization. A corrupting entity known as **NULL** has fractured the mechanisms maintaining the connection to reality.

### Three regions and cores

| Campaign | Region | Theme | Core to restore | Story conflict |
|---|---|---|---|---|
| SQL | **The Lost Archives** | Data libraries, crystalline vaults, forgotten records | Memory Core | History and identity records have been altered, hidden, or erased. |
| Python | **The Serpent Wilds** | Living algorithms, enchanted forests, unstable automata | Logic Core | Infinite loops, broken conditions, and rogue scripts have transformed the landscape. |
| Java | **The Machine Citadel** | Mechanical cities, class-forges, clockwork guardians | Execution Core | Interconnected machines and their architecture are failing. |

Each region presents NULL from a different perspective. The player may discover connections among the incidents, but no campaign depends on knowledge from the others. Avoid spoilers across world selection, tutorials, and shared hub dialogue.

### Endings

- **SQL ending:** Reconstruct enough of the lost identity and history records to restore a route home.
- **Python ending:** Repair the logic network and program an escape path.
- **Java ending:** Rebuild the execution machinery connecting The System to reality.
- **Optional all-world epilogue:** Finishing all three reveals more about NULL. This is a reward for curiosity, never the only “real” ending.

### Narrative tone

Adventurous, strange, occasionally funny, increasingly mysterious; optimistic about learning and persistence. NPCs should talk like inhabitants of the world, not like textbook paragraphs with fantasy nouns substituted.

## 5. World, chapter, and stage structure

**Campaign** = an independently completable language adventure.  
**Chapter** = a coherent sequence of concepts inside a campaign.  
**Stage** = a short objective, practice level, or coding battle.  
**Boss** = a multi-phase integration challenge.  
**Capstone** = a larger, authentic final task with explicit tests and rubric.

**Target full-release shape:** 3 campaigns × 9 core chapters × ~10 stages = approximately **270 stages** (including chapter bosses/reviews). This is a planning target, not a promise or current alpha content. Each campaign must be completable in isolation and must include both beginner onboarding and a meaningful capstone.

### 5.1 SQL — The Lost Archives

| Ch. | Title | Core concepts | Example boss/application |
|---:|---|---|---|
| 1 | The Forgotten Tables | Database/table/row/column basics, SELECT, FROM, aliases | Retrieve records from the Archive Register |
| 2 | The Filtering Grounds | WHERE, comparison and Boolean operators, BETWEEN, IN, LIKE, NULL | Isolate corrupted records |
| 3 | The Sorting Tower | ORDER BY, DISTINCT, LIMIT, combined filters | Rank threats and isolate top targets |
| 4 | The Aggregate Mines | COUNT, SUM, AVG, MIN, MAX, GROUP BY, HAVING | Audit missing resources by sector |
| 5 | The Relational Bridge | Primary/foreign keys, INNER/LEFT JOIN, cardinality | Reconnect separated identity records |
| 6 | The Broken Records | INSERT, UPDATE, DELETE, constraints, safe writes | Repair intentionally damaged data |
| 7 | The Nested Labyrinth | Subqueries, correlated examples, CTEs, set operators | Trace a multi-table anomaly |
| 8 | The Analytics Spire | CASE, window functions, partitions, rankings | Reconstruct historical patterns |
| 9 | The Database Core | Schema design, normalization basics, indexes, transactions, execution plans, practical optimization | **Capstone:** Restore and analyze a damaged database |

The alpha uses a tiny custom read-only SQL subset. Production SQL exercises need a genuine isolated SQL engine, disposable datasets, correctness tests that evaluate **results and side effects**, and safe rollback/reset.

### 5.2 Python — The Serpent Wilds

| Ch. | Title | Core concepts | Example boss/application |
|---:|---|---|---|
| 1 | Hello, World! | Output, variables, values, basic types, input | Restart a damaged terminal |
| 2 | The Branching Woods | Expressions, conditions, Boolean logic | Route signals through logic gates |
| 3 | The Endless Loop | for, while, range, break/continue | Stop or repurpose a rogue loop |
| 4 | The Collection Caverns | Lists, tuples, dictionaries, sets, indexing | Organize scattered fragments |
| 5 | The Function Temple | Functions, parameters, return, scope | Build a reusable ability script |
| 6 | The File Ruins | Strings, files, exceptions, modules | Read, clean, and repair log files |
| 7 | The Object Grove | Classes, instances, inheritance, composition basics | Model and control a digital creature |
| 8 | The Algorithm Arena | Searching, sorting, recursion, time complexity basics | Optimize a pathfinding routine |
| 9 | The Automation Nexus | JSON, HTTP/API concepts, packages, environments, unit testing, automation | **Capstone:** Build a small tested Python tool |

Use actual Python execution with safe isolation and behavior-based tests. Accept different correct implementations; only require particular constructs when that construct itself is the lesson.

### 5.3 Java — The Machine Citadel

| Ch. | Title | Core concepts | Example boss/application |
|---:|---|---|---|
| 1 | The First Machine | Java program structure, output, variables, types | Boot a control console |
| 2 | The Control Circuit | Operators, if/else, switch | Restore logic routing |
| 3 | The Repetition Factory | for/while loops, iteration patterns | Synchronize factory mechanisms |
| 4 | The Array Foundry | Arrays, strings, methods and parameters | Calibrate multiple sensors |
| 5 | The Object Workshop | Classes, objects, constructors, fields | Build a controllable automaton |
| 6 | The Inheritance Hall | Encapsulation, inheritance, polymorphism, interfaces | Reassemble the class hierarchy |
| 7 | The Collection District | Lists, maps, sets, generics, iteration | Organize machine inventories |
| 8 | The Exception Vault | Exceptions, file handling, tests, debugging | Recover from system faults |
| 9 | The System Core | Data structures, algorithm fundamentals, streams, concurrency concepts | **Capstone:** Create a tested Java application |

Use real Java compilation and execution in a constrained environment. Clearly teach full source-file structure versus isolated statements, and don't teach snippet-only shortcuts as general Java programs.

### Completeness gates for each campaign

A campaign is not called “complete” until it has: reviewed lesson content; practice stages; chapter-end checks; mixed review; a multi-step final capstone; accessible hints; actual execution and robust tests; an independent ending; and a verified save/resume path.

## 6. Core gameplay loop

1. **Choose any campaign** from the shared System hub.
2. **Select a stage** within an unlocked chapter on its own map.
3. **Assemble a four-unit team** using any characters in the universal roster.
4. **Enter the coding phase:** read the mission and data, write code, inspect sample results, ask for hints, and debug at your own pace. Enemies pause.
5. **Cast a validated spell:** the solution is checked against the learning objective. If valid, it powers team abilities.
6. **Watch short auto-combat:** units attack and buffs/defenses trigger; enemies react within a bounded combat window.
7. **Continue to another phase** until the mission is fulfilled or a retry is needed.
8. **Earn progression rewards:** campaign mastery/XP, Core Shards, collectibles, and story advancement.
9. **Summon and build teams** in the hub, then repeat.

### 6.1 Example: SQL targeting battle

**Enemy:** Glitch Blob and two weak minions.  
**Dataset:** `enemies(id, name, armor, hp)`; sample rows visible to the player.  
**Goal:** Select names of enemies whose armor is below 20.  
**One valid answer:** `SELECT name FROM enemies WHERE armor < 20;`  
**Validation:** Compare returned rows under multiple test fixtures (including unexpected data) to the objective; allow equivalent correct queries.  
**Combat:** Selected enemies receive a Marked debuff, then the party attacks.  
**Learning objective:** Build a correct `SELECT` with `WHERE`, not memorize the provided query.

### 6.2 Coding versus combat phases

- **Run Code:** Fast, safe draft evaluation on visible tests with error/output feedback. No penalties or combat advance.
- **Cast Spell:** Validate against authoritative hidden tests, then activate combat once the task passes. Invalid code does not trigger punishment; player remains in code phase and receives actionable feedback.
- **Auto-battle:** Short, noninteractive action window with readable animation and combat log. Basic attacks + powers + status effects resolve; then coding resumes.
- **Bosses:** Multiple coding/combat phases testing combined concepts, culminating in a transfer task.
- **Failure:** If team HP reaches zero during an actual enemy retaliation in a later build, allow a free retry/checkpoint and preserve learned skills and previously earned rewards. Never punish syntax errors with lost progress.

### 6.3 Combat balance targets (proposals)

- Four active party slots; never demand a particular rarity or character for a win.
- Code completion contributes the **majority of meaningful combat output** (initial tuning hypothesis: around 70–75%). Character stats and synergy influence style and efficiency, not eligibility.
- Enemy HP, basic attack, code spell, healing, shielding, affinity and status effects should use transparent, testable formulas.
- Expose key statistics in-game; design against dominant one-shot or infinite-loop strategies.
- Do not add typing timers by default. Timed challenges, if ever implemented, must be optional, accessible and never necessary for advancement.

### 6.4 Concept-themed effects

| Coding concept | Example gameplay effect |
|---|---|
| SQL SELECT / WHERE | Identify targets, apply Marked status |
| SQL JOIN / GROUP BY | Expose links or trigger group-wide tactics |
| Python conditionals | Conditional shields or reactive actions |
| Python loops | Multi-hit attacks and combos |
| Python functions | Reusable powers and team buffs |
| Java classes/objects | Summon constructs or deploy units |
| Java interfaces/polymorphism | Change formations or combine roles |

Gameplay effects should require **semantically correct code**, not keyword detection. They must match the stage objective and support the lesson, not encourage gratuitous or unidiomatic code.

## 7. Character collection and gacha

### 7.1 Character design

Each unit has: `id`, name, world of origin, rarity, class/role, health, basic attack, ability, passive, upgrade progression, art and lore. The starting alpha has **12 units** with simpler stats and descriptive abilities; many complex abilities are not yet implemented.

**Roles:** Tank, healer/support, caster, ranged DPS, melee/assassin, hybrid/utility. **World affinities** add modest bonuses on home campaigns but any owned character can play in any world.

### 7.2 Summoning and economy

**Currency:** Core Shards, awarded for clearing new stages and meaningful achievements.
**Alpha summon cost:** 100 Core Shards per single roll.
**Alpha rarity odds:** Common 55%, Rare 30%, Epic 12%, Legendary 3%.  
**Alpha guarantee/pity:** Not implemented. Document this clearly if adding it.  
**Duplicates:** Tracked in the alpha; planned shard/upgrade systems are not implemented.

**Design constraints:**
- All base campaign content is available for free; no premium characters required.
- Do not use real-money paid gacha, loot box purchases, artificial loss pressure, or manipulative notification loops as the default model.
- Publish exact roll odds and any guarantee rules; do not change rates silently.
- Ensure deterministic access to essential starter team roles.
- Consider a deterministic progression-earned unlock track alongside randomized summons.
- Keep rarity powerful enough to be interesting but never superior to programming mastery.

### 7.3 Character evolution via learning

**Code Evolution** is a proposed signature mechanic: some characters evolve when the player demonstrates mastery of relevant coding concepts (for example, independently completing filtering, sorting and grouping challenges to evolve Query Mage). Summoning duplicates may accelerate cosmetic or nonessential growth, but cannot replace skill requirements. Evolution must not lock a campaign ending behind lucky pulls.

## 8. Progression and learning assessment

### Player progress

Track independent world saves by `campaign_id`, `chapter_id`, `stage_id`, checkpoint, `mastery_by_skill`, attempts, completion outcomes and earned rewards. Store universal roster/party and wallet separately. Cross-world transfers never unlock unrelated chapters automatically.

### Skill mastery

- **Introduced:** Worked example or tutorial completed.
- **Practiced:** Guided or familiar context solved.
- **Mastered:** Independent solution on a fresh/unseen context, plus successful mixed review.

Mastery should reflect evidence, not just repeated button presses. Replays provide practice, but cannot be exploited to mint unlimited first-clear rewards. Players can revisit weak topics without penalty.

### Rewards

First clears grant experience and Core Shards; boss clears additionally grant a significant story reward. Add cosmetic badges and journal entries for mastery; keep the reward flow predictable. The alpha currently grants **35 Core Shards / 55 XP** on a new non-boss clear and **60 Core Shards / 120 XP** on a new boss clear.

### Testing integrity

- Test behavior, output, database state and edge cases, not literal source-code strings, except when assessing syntax by design.
- Give appropriate error messages without disclosing hidden test inputs that make the answer trivial.
- Different valid algorithms or SQL forms should pass when they satisfy the goal.
- Make hidden tests stable, explainable, and consistent with prompt wording.
- Be careful with nondeterminism, float comparisons, result ordering and equivalent SQL result sets.

## 9. UX and input design

### Shared hub

Home screen, campaign select, independent maps, summoning, roster/team editor, journal/codex, settings, progress and story replays. Show clear “continue” actions per campaign and never imply SQL → Python → Java is a required sequence.

### Desktop

Responsive layout with full-size coding area, visible battlefield and console output; keyboard shortcuts (run and cast); resizable panels are desirable. Laptop is the best environment for full-length programming.

### Phone portrait — preferred mobile mode

Combat occupies roughly the **upper 30–40%** of usable space, with challenge/editor/console in the lower **60–70%**. During keyboard focus, shrink or collapse battle to a compact status strip; keep the code cursor and Run/Cast buttons reachable without fighting the on-screen keyboard. Avoid viewport-jump and horizontal scrolling. Make spell effects legible in small spaces.

### Phone landscape — optional

Battlefield on the left, editor/console on the right, with adaptive layout for the soft keyboard. Do not force rotation or assume physical keyboards.

### Accessibility and inclusion

- Full keyboard support on desktop; touch targets large enough for phones.
- Labels, status announcements and clear focus management; avoid relying on color alone.
- Respect reduced motion; provide an animation skip/fast-forward toggle.
- Contrast-conscious light/dark themes as feasible; zoom and text scaling.
- Preserve draft text when switching panels, opening hints or rotating.
- Helpful feedback for novices; no shaming for mistakes.

## 10. Onboarding / first session

1. Opening scene and quick explanation of being trapped in The System.
2. Let the player **freely select SQL, Python, or Java** after one shared tutorial on game controls (not a prerequisite language lesson).
3. Offer an accessible starter party sufficient to clear every first chapter.
4. Introduce the code editor with a tiny tutorial: Run Code, read errors, Cast Spell.
5. Complete an early stage and show a brief auto-battle payoff.
6. Award first-clear Core Shards, offer an optional first summon, then return to that campaign map.
7. Reveal the codex and saved progress, without mandatory onboarding detours.

## 11. Technical system requirements (target)

**Current alpha:** Static HTML/CSS/vanilla JS, locally generated pixel-art assets, localStorage save, no backend. SQL is a narrow custom SELECT evaluator against a demo data array. Python/Java use limited pattern validators and **do not execute** code.

**Production direction (not implemented yet):**
- Modular web app (React + TypeScript is one candidate, not a requirement to rewrite immediately).
- Accessible code editor (Monaco or CodeMirror are candidates).
- Independent content schema for campaigns/chapters/stages/test data.
- Deterministic, unit-tested combat engine decoupled from rendering.
- Real SQL in an isolated read-only/disposable DB for SELECT tasks, with transaction isolation and reset for mutations.
- Python and Java execution in isolated, resource-limited sandboxes. Untrusted source code must **never** run with server secrets, unrestricted filesystem, host networking, or other tenants' data.
- Safe checks against resource abuse: wall time, CPU, RAM, output size, process count, and request rate; per-task ephemeral runners.
- Auth/cloud saves only when appropriate, with a clear migration path from local saves.
- Versioned save schema and tests for migration and data integrity.

See `docs/TECHNICAL_PLAN.md` for the stepwise roadmap.

## 12. Success metrics

Prefer real learning evidence over engagement-only metrics.

**Learning:** Improvement from pre-test to unseen post-test; independent correct-solution rate; mastery retention at later chapters; ability to solve capstones.  
**Game feel:** Number of code-to-combat successes, clarity of spell payoff, percentage of players who understand how their code affected combat.  
**Usability:** Completion rate of first 3 stages, code editor friction on mobile, accessibility issues, recoverability from errors, session crash rate.  
**Progression:** Chapter completion (by campaign); balanced class use; proportion of progress attainable with just starter units.

Do **not** optimize for gacha spending, artificial session length or compulsive return loops.

## 13. Scope and release definition

### Alpha 0.1 — existing

- Three independently selectable maps, four stages each (12 total).
- Two-phase boss in each world's currently playable slice.
- Four-unit parties, 12 collectible characters, 100-shard reconstruction, simple odds, localStorage.
- Static responsive layout: desktop, phone portrait, phone landscape.
- Simple SQL subset implementation; pattern-based Python/Java checks.

**Not included:** Complete nine-chapter campaigns, actual Python or Java runtime, complete SQLite, robust combat/HP system, code-evolution mechanic, full story endings, cloud saves, accessibility audit, or real-money purchase systems.

### First educationally credible vertical slice

- One polished SQL chapter with real SQL execution and multiple valid solutions.
- 8–10 reviewed stages, lesson text, sample tests, hidden tests, multi-phase boss, journal/mastery.
- Fully instrumented 4-unit auto-combat with meaningful and testable abilities.
- Reliable mobile code editing, local save and migration coverage.
- Starter roster and free summon loop.

### Later releases

Add real Python and Java execution, expand each independent curriculum, incorporate stories and endings, balance rarity and roles, then build richer art/sound. See roadmap for priority and acceptance criteria.

## 14. Design decisions and open questions

**Decided:** Independent campaigns; shared universe and gacha roster; laptop and phone support; portrait split combat; free-to-earn character collecting; coding as core progression.  
**Proposed, requires prototyping:** 4-unit party balance, 270-stage scale, percentage of damage attributable to code, rarity tuning, combat duration, chapter pacing, evolution requirements, art and sound identity.  
**Not decided:** Multiplayer, native mobile apps, monetization, age rating, final title, cloud-save provider, runtime hosting stack, and long-term content production process.

## 15. Glossary

- **The System:** The virtual universe where the game takes place.
- **NULL:** The corrupting antagonist/process.
- **World / campaign:** A complete independent language route.
- **Core:** Memory (SQL), Logic (Python), Execution (Java).
- **Core Shards:** Earnable summon currency.
- **Codex:** Player journal, learning history and mastery tracker.
- **Code Evolution:** Proposed character evolution tied to demonstrated coding skill.
- **Code & Combat:** Working name for alternating code phase and auto-battle phase.

---

**Change control:** Any material change to campaign independence, educational fairness, lore endings, code validation behavior or economy must update this GDD, the roadmap and relevant tests together.


## Currency and reconstruction update ? 2026-10-31

Core Shards replace the former Byte Gem name. They are intact fragments recovered when code clears NULL's corruption. A first normal-stage clear awards 35 shards, a boss awards 60, and new players receive 200. Replays never duplicate these rewards. Reconstructing one companion costs 100 shards, with the same published rarity odds. Existing currency balances migrate one-for-one; campaign progress, drafts, companions and party are preserved.

Reconstruction has its own navigation screen with a skippable signal assembly animation and explicit new/duplicate results. Duplicate copies remain collection counts, not upgrades or extra party slots. A roll is committed before its animation starts. Leaving the tab or skipping cannot reroll, lose a result, or charge twice. The Party screen exposes four explicit slots; selecting a slot and an owned reserve replaces exactly that slot. Essential starter companions and campaign independence are unchanged. This update supersedes older gem terminology and the combined summon/party interface above.


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


## Manual skill charge update (2026-10-31)

User-approved revision supersedes automatic character-skill activation on lesson casts. In all three independent campaigns, correct lesson casts still resolve baseline auto-attacks, attack spells and utility without requiring any character skill. Each living auto-attacker gains 8 bits; 8 bits equal one Byte. Character costs range from 12 to 24 bits and are reduced by 1 bit per ascension star (minimum 8). Charge caps at the current cost and resets on stage entry or free retry; it is encounter-local, with no save migration.

A full charge highlights the battle portrait. Clicking it opens a character-themed coding prompt in the selected language, using the existing isolated behavioral grader and visible evaluator limitations. Intro prompts use output/arithmetic or basic SQL; later Python/Java prompts use a small function with transfer cases. Run Code is safe practice. Use Skill spends charge only on a correct committed answer and activates only the selected living character. Closing, wrong answers and unsupported/runtime-loading failures preserve charge; wrong committed answers cause normal enemy retaliation. Skills never advance lesson examples, grant stage rewards, generate charge, or finish a fight before all lesson objectives are solved.

Skill effects now activate manually: Query/Echo deal 4 damage, Nova 6, and Zero 10 when enemy HP is at most 80. Byte grants 12 self-shield, Patch up to 8 healing, Bolt 8 self-shield, Pip 8 shielding to the least-shielded living ally. Fern/Rune/Atlas prepare their established single-hit/AoE guards. Sol grants 16 utility and retains its once-per-attempt 35% revival. Skill descriptions and charge costs appear in Your party. See docs/CHARACTER_GUIDE.md, scripts/skill-charge.js and scripts/skill-prompts.js for current tunable values.
