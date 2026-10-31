# AGENTS.md — Instructions for coding agents and collaborators

These instructions apply throughout this repository. They complement, and do not override, the project design source of truth in `docs/GAME_DESIGN_DOCUMENT.md`.

## Mission

Build **ESCAPE.EXE**, an accessible browser coding RPG where learners progress through **three independent, fully teachable** SQL, Python and Java campaigns. The player is a programmer trapped in The System. A universal team of summoned digital characters fights automatically during combat windows, powered by **correct, genuinely tested code**.

## Immutable product invariants

- SQL, Python and Java campaigns start unlocked, progress independently, and each ultimately has its own valid completion/ending. Never add language-to-language progression prerequisites.
- Coding is the gate; summons only add strategy. Do not gate learning content or wins on rarity, gacha luck, ads or purchases.
- Input and reasoning should not be timed during the ordinary coding phase. Errors and retries are teachable, not punishable.
- Keep `Run Code` distinct from `Cast Spell` and clearly state evaluation limitations.
- Do not copy protected third-party game assets or distinctive IP.
- Follow `docs/GAME_DESIGN_DOCUMENT.md`; if a feature contradicts it, explain and propose a design update first.

## What exists today

Read README.md before editing. The current build has 16 stages per language across four short chapters, modular vanilla HTML/CSS/JavaScript, original canvas pixel art, local saves, skills/ascension and story recruits. SQL executes real read-only SQLite in workers; Python executes real CPython through a restricted Pyodide worker sandbox. Java uses a bounded AST teaching interpreter, **not a JVM or javac**. Advanced curriculum, full Java compilation, complete language coverage and independent story endings remain planned. See docs/LEARNING_PLAN.md and docs/TECHNICAL_PLAN.md for exact boundaries. Historical appended notes below are superseded by the current README.

## How to implement changes

1. Inspect the affected files and existing UI flows; preserve working behavior.
2. State what the change will teach or enable and which world(s) it affects.
3. Prefer small cohesive PRs. Separate structured learning content, game state, combat logic and presentation as the project is refactored.
4. For new stages, include learning objective, sample dataset/input, expected observable behavior, alternative correct solutions, edge cases, hint tiers, combat effect, and mastery signal.
5. Use safe DOM updates and escape user-provided strings. Never inject raw player code or evaluation output into HTML without escaping.
6. Verify all affected world progression separately, party size rules, local saves, Run/Cast behavior, and both desktop/mobile layouts.
7. Update `README.md` and relevant `docs/` files when implementation or scope changes. Mark planned behavior as planned.

## Coding and security rules

- Current stack: vanilla HTML/CSS/JavaScript. Avoid imposing a full framework rewrite in a small feature PR without justification.
- Use descriptive names, small pure functions for tests and combat rules, predictable IDs, and explicit state/data schemas.
- SQL now uses isolated disposable SQLite. Keep its real result-based grading and fixture resets; never replace it with a growing regex dialect. Java remains a documented subset and requires a full isolated JVM before advanced Java content.
- **Never execute arbitrary player Python/Java/SQL in the host application process.** Use isolated, ephemeral execution environments with strict CPU, memory, wall-clock, output, storage and network limits. Mutating SQL tasks need disposable databases and rollback/reset.
- Test behavior instead of matching exact source strings; recognize semantically valid alternatives. Do not make hidden tests inconsistent with instructions.
- Never commit secrets, API credentials, student submissions, tokens or unnecessary telemetry.
- Treat saved state as untrusted and version save formats before migrations.
- Avoid deceptive progress or fake results: if a capability is stubbed, label it as a demo.

## Quality gates

- Test starting any of the three campaigns first from a fresh save.
- Test clearing a stage, moving to the next, replaying a stage without duplicating rewards, summoning, and team constraints.
- Test syntax errors, incorrect logic, successful solutions, hints, empty input and alternative correct answers where supported.
- Test screen widths around 390px portrait, 844×390 landscape and 1280px+ desktop. Check editor focus and mobile keyboard behavior manually where possible.
- Test keyboard navigation, accessible labels, visible focus and reduced motion as functionality grows.

## Preferred delivery format

For a code change, report: **what changed**, **why**, **files touched**, **how tested**, **known limitations**, and **next logical step**. If you could not run a test or deploy, say so. Do not manufacture completion metrics.

## Important reference files

- `docs/GAME_DESIGN_DOCUMENT.md` — product pillars, world lore, curriculum and game mechanics.
- `docs/ROADMAP.md` — prioritized milestones and exit criteria.
- `docs/TECHNICAL_PLAN.md` — current architecture and safe future implementation.
- `PROJECT_INSTRUCTIONS_CHATGPT.md` — copyable instructions for the ChatGPT Project.
- `CONTRIBUTING.md` — collaborator workflow.


## Approved combat revision (2026-10-31)

Per the explicit user request, invalid Cast Spell attempts now trigger enemy retaliation. Run Code remains a safe untimed practice action. Preserve free retries, drafts, boss checkpoints and earned progress. This supersedes earlier no-punishment wording for committed casts only. Ascension uses 1/3/5 additional duplicates, capped at three stars. See the design document for formulas.


## Approved starter-party revision (2026-10-31)

Fresh saves start with only Byte Knight. Patch, Echo and Pip join as Stages 2, 3 and 4 of the current chapter unlock, respectively (explicit user clarification: stages, not future chapters). Party size grows 1?4; old collections and full parties remain intact. Recruitment is shared, free and once-only across independent campaigns.
