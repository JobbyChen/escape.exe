# Technical plan

The game is a buildless vanilla JavaScript app. Campaign content, save rules, validation, pixel rendering and UI orchestration are separate modules. Save schema version 1 validates wallet, party, progress and draft input on load. DOM updates use textContent for all player-visible dynamic strings.

Next priorities: real isolated SQLite with resettable fixtures and behavior-based tests; then resource-limited isolated Python/Java runtimes. Never execute untrusted source in the host process. Full chapters, independent endings, unique companion abilities and mastery assessments remain planned.

The manifest and offline worker support mobile browser use. Native app packaging and store submission are separate future work. Test on real Android/iOS devices before claiming mobile release readiness.


## Desktop shell and stage transitions

At widths of 1024px and above, the header, game area and footer share a fixed viewport grid. Navigation occupies the right column, and coding remains on the right of combat. Reference data, results and roster lists have bounded internal overflow so controls remain reachable. Smaller screens retain responsive document flow.

Successful casts show the reward and schedule the next stage after 1.8 seconds. Both boss seals must pass before leaving a boss; completing a boss returns to campaign selection. Screen navigation cancels scheduled transitions with a navigation version guard. Saves and first-clear rewards are committed before transition. Coding time remains unlimited.

Canvas ambient movement, attack impact, party attacks and screen-entry transitions respect reduced motion and the saved animation preference. Browser regression checks use the installed Edge browser, an isolated ignored profile and Node's built-in DevTools transport; no browser package is required.
