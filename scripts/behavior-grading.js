// Browser-only evaluation. Every test gets a fresh worker and disposable language state.
function executeCases(language, payloads) {
  return new Promise((resolve) => {
    const worker = new Worker(
      new URL(`./runners/${language}-worker.js`, import.meta.url),
      language === "java" ? { type: "module" } : {},
    );
    let timer,
      index = 0;
    const results = [];
    const finish = (result) => {
      clearTimeout(timer);
      worker.terminate();
      resolve(result);
    };
    const timeout = () =>
      finish([
        ...results,
        {
          error:
            "Execution timed out. Simplify the algorithm or check for an infinite loop.",
        },
      ]);
    const arm = (ms) => {
      clearTimeout(timer);
      timer = setTimeout(timeout, ms);
    };
    arm(45000);
    worker.onmessage = ({ data }) => {
      if (data.ready) {
        arm(2500);
        return;
      }
      results.push(data);
      if (data.error || ++index === payloads.length) {
        finish(results);
        return;
      }
      arm(2500);
      worker.postMessage(payloads[index]);
    };
    worker.onerror = (event) =>
      finish([
        ...results,
        { error: event.message || "Browser runtime failed to load." },
      ]);
    worker.postMessage(payloads[0]);
  });
}
const normalized = (value) => JSON.stringify(value);
export async function gradeBehavior(
  language,
  exercise,
  source,
  authoritative = false,
) {
  if (!source.trim())
    return {
      ok: false,
      kind: "syntax",
      message: "Write your solution before running or casting.",
    };
  if (source.length > 12000)
    return {
      ok: false,
      kind: "limit",
      message: "This editor allows at most 12,000 characters.",
    };
  const tests = exercise.tests || [
    { context: {}, expected: exercise.expected },
  ];
  const active = authoritative ? tests : tests.filter((test) => !test.hidden);
  const results = await executeCases(
    language,
    active.map((test) => ({
      source,
      entry: exercise.entry,
      args: test.args,
      context: test.context,
      fixtures: test.fixtures || exercise.fixtures,
      table: exercise.table,
      rows: test.rows || exercise.rows,
    })),
  );
  for (let index = 0; index < results.length; index++) {
    const test = active[index];
    const result = results[index];
    if (result.error) {
      const unavailable =
        /failed to (?:fetch|load)|runtime failed|network/i.test(result.error);
      const unsupported =
        /unsupported|outside this bounded|not available in this sandbox/i.test(
          result.error,
        );
      return {
        ok: false,
        kind: unavailable
          ? "unavailable"
          : unsupported
            ? "unsupported"
            : "runtime",
        message: result.error,
      };
    }
    let actual;
    if (language === "sql") {
      actual = result.result.rows;
      if (!exercise.entry && !exercise.tests) {
        if (exercise.kind === "all")
          actual = actual.map((row) =>
            Object.fromEntries(
              result.result.columns.map((column, i) => [column, row[i]]),
            ),
          );
        else actual = actual.map((row) => row[0]);
      }
      if (!exercise.ordered)
        actual = [...actual].sort((a, b) =>
          normalized(a).localeCompare(normalized(b)),
        );
    } else actual = exercise.entry ? result.result.value : result.result.output;
    let expected = test.expected;
    if (language === "sql" && !exercise.ordered)
      expected = [...expected].sort((a, b) =>
        normalized(a).localeCompare(normalized(b)),
      );
    if (normalized(actual) !== normalized(expected))
      return {
        ok: false,
        kind: "wrong",
        message: test.hidden
          ? "A transfer test failed. Check boundaries and inputs beyond the example."
          : `Sample ${index + 1} failed.\nExpected: ${normalized(expected)}\nReceived: ${normalized(actual)}`,
      };
  }
  return {
    ok: true,
    message: `${active.length} ${authoritative ? "sample and transfer" : "visible"} tests passed. ${language === "java" ? "Executed by the documented bounded Java teaching interpreter (not a JVM)." : language === "sql" ? "Executed with real SQLite in a disposable browser worker." : "Executed with Python in a disposable browser worker."}`,
  };
}
