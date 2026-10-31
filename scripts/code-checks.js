import { enemies } from "./campaigns.js";
// Bounded practice checks only. Never execute player source or pass it to eval.
export function checkCode(language, kind, source, phase = 0) {
  if (!source.trim())
    return {
      ok: false,
      message: "Write some code first, or use Hint for a starting point.",
    };
  if (source.length > 4000)
    return { ok: false, message: "Keep practice code under 4,000 characters." };
  const task =
    kind === "boss"
      ? phase === 0
        ? language === "sql"
          ? "names"
          : "hello"
        : language === "sql"
          ? "filter"
          : "variable"
      : kind;
  if (language === "sql") return checkSql(task, source);
  const java = language === "java";
  const patterns = java
    ? {
        hello: /^\s*System\.out\.println\s*\(\s*"Hello, System!"\s*\)\s*;\s*$/,
        addition:
          /^\s*System\.out\.println\s*\(\s*(?:6\s*\+\s*4|4\s*\+\s*6|10)\s*\)\s*;\s*$/,
        variable:
          /^\s*int\s+energy\s*=\s*10\s*;\s*System\.out\.println\s*\(\s*energy\s*\)\s*;\s*$/,
      }
    : {
        hello: /^\s*print\s*\(\s*(["'])Hello, System!\1\s*\)\s*;?\s*$/,
        addition: /^\s*print\s*\(\s*(?:6\s*\+\s*4|4\s*\+\s*6|10)\s*\)\s*;?\s*$/,
        variable:
          /^\s*energy\s*=\s*10\s*(?:;|\n)\s*print\s*\(\s*energy\s*\)\s*;?\s*$/,
      };
  if (java && /'Hello, System!'/.test(source))
    return {
      ok: false,
      message:
        "Java strings use double quotes. Single quotes are for individual characters.",
    };
  const ok = patterns[task].test(source);
  return {
    ok,
    message: ok
      ? `Practice check passed. Expected output: ${task === "hello" ? "Hello, System!" : "10"}. This code was not executed.`
      : "Could not verify this practice pattern. Check the requested values, spelling, quotes and punctuation. Other valid programs may be unsupported; use Hint.",
  };
}
function checkSql(task, source) {
  const match = source
    .trim()
    .match(
      /^select\s+(\*|name|id\s*,\s*name\s*,\s*armor\s*,\s*hp)\s+from\s+enemies(?:\s+where\s+(armor\s*(?:<=|>=|<|>|=)\s*\d+|\d+\s*>\s*armor))?\s*;?$/i,
    );
  if (!match)
    return {
      ok: false,
      message:
        "Supported subset: SELECT * or name FROM enemies, optionally WHERE armor < number. This prototype is not a full SQL engine.",
    };
  let rows = enemies;
  if (match[2]) {
    const condition = match[2].replace(/\s/g, "");
    const reversed = condition.match(/^(\d+)>armor$/i);
    const normal = condition.match(/^armor(<=|>=|<|>|=)(\d+)$/i);
    rows = rows.filter((row) =>
      reversed
        ? +reversed[1] > row.armor
        : {
            "<": row.armor < +normal[2],
            "<=": row.armor <= +normal[2],
            ">": row.armor > +normal[2],
            ">=": row.armor >= +normal[2],
            "=": row.armor === +normal[2],
          }[normal[1]],
    );
  }
  const actual =
    match[1].toLowerCase() === "name" ? rows.map((row) => row.name) : rows;
  const expected =
    task === "all"
      ? enemies
      : task === "names"
        ? enemies.map((row) => row.name)
        : enemies.filter((row) => row.armor < 20).map((row) => row.name);
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  return {
    ok,
    message:
      (ok
        ? "Objective met."
        : "Query ran, but rows or columns do not match the objective.") +
      "\n" +
      JSON.stringify(actual, null, 2),
  };
}
