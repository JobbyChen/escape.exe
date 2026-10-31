# Technical plan

## Current architecture

Buildless HTML/CSS/JavaScript, 16 stages per route, four chapters, versioned local saves and browser-local code execution. Game content, grading, skill effects, combat and presentation live in separate readable modules. Runtime assets are pinned locally under vendor/ with licenses and SHA-256 checksums.

The live grader is scripts/behavior-grading.js, re-exported by code-checks.js. legacy-code-checks.js exists only as a historical regression fixture; it is not used to gate player progression.

## Execution boundaries

- SQL: sql.js 1.13.0 SQLite WebAssembly. Each case creates and closes a fresh database from authored fixtures. query_only is enabled; max_page_count=256 and hard_heap_limit=16 MB are set. Results are bounded to 10,000 cells and row payload length. Ordering is checked only where required.
- Python: Pyodide 0.27.7 CPython. Each case compiles and executes the student's program in a new restricted namespace. Imports, file access, private/internal attributes, classes, async and selected unbounded constructs are rejected. AST guards bound iterations/calls; collection/string operations have size/allocation checks. This is real Python within an explicit beginner sandbox, not unrestricted Python.
- Java: a custom token/AST teaching interpreter. It supports integer, Boolean, String, char, one-dimensional arrays, conditionals, loops, returns and static methods. It checks primitive assignments, parameter and return types, array bounds and definite reads of initialized variables. It is not javac/JVM and does not implement the entire Java language or standard library. Source is never passed to eval or Function.

Every Run/Cast evaluation gets a new worker. Multiple fixtures within that evaluation share the loaded engine but not the student's namespace/environment/database. Workers terminate on result, error or wall timeout. Runtime load has 45 seconds; each ready test has 2.5 seconds. Java has 30,000 execution steps and collection limits; Python limits loop iterations/calls and allocations. Source length is limited to 12,000 characters, output to roughly 12 KB. Browser allocation is not a container/OS RAM guarantee: this is a local educational runtime, not a production adversarial multi-tenant judge. Never execute player code in a host language process.

The language runtime is loaded before student execution. Python cannot import JS bridges, networking, or unrestricted built-ins through the provided namespace. Java exposes only documented safe built-ins. SQLite uses disposable data and no host database. No student source is sent to external services.

## UI and progression

Run Code checks visible cases. Cast Spell includes transfer cases. Async evaluation disables conflicting controls and announces busy state. Loading failures and unsupported forms leave health unchanged. Wrong/syntax/runtime failures on committed casts trigger the existing bounded retaliation. Problem text scrolls within a dedicated desktop pane; the editor and action controls stay visible.

Chapter maps show four stages at a time; each next chapter unlocks independently after its preceding checkpoint. Progress uses stable stage indices 0?15, and saves accept all new draft keys while retaining old four-stage progress. Shared recruits remain tied to current Stage 2/3/4 unlocks, not later chapter entry. Boss rewards apply at every fourth stage; replays never duplicate rewards.

## Next priorities

Full isolated Java compilation/execution; reviewed advanced curriculum; wider Python sandbox support; disposable SQL mutations; genuinely unseen assessment and retention checks; real-device editor testing. See LEARNING_PLAN.md and ROADMAP.md. Do not describe unsupported advanced language topics or full campaign endings as implemented.

The Full editor control presents the statement and code side-by-side on desktop. Committing a cast returns to the battle layout so damage feedback and free retry remain reachable; safe Run Code stays in the expanded workspace. The default layout keeps the battlefield visible.
