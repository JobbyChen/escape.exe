# Learning progression

## Implemented scope

Each independent route has 16 playable stages across four compact chapters. Three examples per normal stage and four per chapter checkpoint produce 52 examples per route (156 total). Stages 1?4 keep the established onboarding and guaranteed party arrivals. Later stages move into function/query contracts and behavior-based sample/transfer tests. This is a substantial foundation, not a comprehensive course or a mastery certificate.

The problem format borrows the useful structure of coding-challenge platforms: statement, contract, constraints, examples, edge cases, tests and optional escalating hints. Beginners get a short lesson before a problem and checkpoint review before later material. Code length is a consequence of reasoning and algorithmic work, never a grading requirement.

## References reviewed

- [Bro Code: Java Full Course](https://www.youtube.com/watch?v=xTtL8E4LzTQ) is the requested Java reference for introductory concepts and further study.
- [University of Helsinki Python Programming MOOC 2026](https://programming-26.mooc.fi/) distinguishes introductory and advanced study. Its [getting-started lesson](https://programming-26.mooc.fi/part-1/1-getting-started/) and [functions material](https://programming-26.mooc.fi/part-4/2-more-functions/) informed the progression from output and expressions toward reusable functions and test feedback.
- [Helsinki's exercise index](https://programming-26.mooc.fi/all-exercises/) and [classes/objects section](https://programming-26.mooc.fi/part-8/) help identify the later coverage still missing here.
- [Helsinki Java Programming](https://java-programming.mooc.fi/) provides another reference for exercise-led learning.
- [SQLite SELECT documentation](https://www.sqlite.org/lang_select.html) is the reference for the real SQL evaluator and query curriculum.

References inform topic sequencing and coverage, not copied questions or solutions. All game scenarios, test data and worked solutions are authored for ESCAPE.EXE. No affiliation, course equivalence or endorsement is claimed.

## Current chapter shape

| Chapter | Stages | Python / Java | SQL |
| --- | --- | --- | --- |
| 1 | 1?4 | Output, variables, arithmetic, mixed onboarding | SELECT, projection, filtering, mixed queries |
| 2 | 5?8 | Functions, branching, Boolean rules, for/while loops, checksum review | Boolean filters, ordering, aggregates, grouped checkpoint |
| 3 | 9?12 | Collections, stateful scans, run-length encoding, distinct-index pair search | Inner/left joins, empty groups, HAVING, relational checkpoint |
| 4 | 13?16 | GCD, sliding windows, binary search, ordered buy/sell capstone | Subqueries, CTEs, window ranking, mixed report capstone |

Every stage includes a skill objective, visible input, expected observable output, starter scaffolding, authored reference, test cases, edge cases, hints, combat effect and a practice-only mastery signal. Prerequisites are earlier stages in the same route; no language is a prerequisite for another.

## Assessment behavior

Run Code checks visible samples. Cast Spell also checks transfer cases, including empty inputs, negative values, duplicates, exact boundaries, missing search targets, all-negative windows and alternate relational fixtures as applicable. A valid general implementation can solve successive batches without being rewritten; code is carried forward when the contract is unchanged. Tests assess output/results rather than literal source strings or arbitrary line counts.

This browser-local app ships its tests and reference solutions, so transfer cases are pedagogical checks rather than secure proctored hidden tests. Real mastery requires unseen independent work and later mixed review. Runtime/unsupported-form failures do not damage the party; an actual wrong committed solution still triggers the user-requested enemy retaliation. Run Code remains safe practice.

## Missing work for comprehensive learning

The next curriculum increments should be reviewed individually and ship with genuine behavior tests:

1. Python: input parsing, dictionaries/sets in larger tasks, exceptions, modules, file/JSON processing, classes and composition, unit testing, packages and an authentic automation project. Broader Python syntax requires deliberate sandbox support.
2. Java: a full isolated compiler/JVM before teaching objects, constructors, interfaces, generics, collections, exceptions, files, streams or concurrency. The current bounded interpreter must never be described as full Java or javac.
3. SQL: writes/constraints/transactions on disposable writable databases, normalization, indexes, query plans and a realistic multi-table capstone. Current SQL is intentionally read-only.
4. All routes: independent chapter reviews, retention checks, mastery evidence, content review with beginners, mobile editing tests, and eventual independent story endings.

The original nine-chapter-per-language vision remains a planning target. The current four short chapters reorganize the prototype foundation and do not claim to fulfill that entire vision. Avoid padding stage counts with repeated trivial edits or presenting unimplemented subjects as playable.
