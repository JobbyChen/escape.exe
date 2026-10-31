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

Read `README.md` before editing. Current Alpha 0.1 is static `index.html` + `styles.css` + `game.js`, browser localStorage, local PNG art, four stages per language, a toy SQL subset, and regex/pattern Python/Java checks. **No actual Python/Java execution or full SQL engine exists.** Do not describe these validators as production-grade. Planned character powers and story endings are not all implemented.

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
- The current browser SQL evaluator is not a substitute for SQLite. Replace it deliberately with an isolated real engine, rather than adding an endless regex dialect.
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
