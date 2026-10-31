// Historical pattern-check regression fixture. The game does not use this validator.
import { enemies } from "./campaigns.js";
// Bounded practice checks only. Never execute player source or pass it to eval.
export function checkCode(language, kind, source, phase = 0, exercise = null) {
  if (exercise) return checkLessonExercise(language, exercise, source);
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

function checkLessonExercise(language, exercise, source) {
  if (!source.trim() || source.length > 4000)
    return {
      ok: false,
      message: "Enter between 1 and 4,000 characters of practice code.",
    };
  if (language !== "sql") {
    // Parameter substitution normalizes this authored variant to the existing bounded pattern checks.
    let normalized = source;
    if (exercise.kind === "hello") {
      if (!source.includes(exercise.greeting))
        return {
          ok: false,
          message: `Print the current message: ${exercise.greeting}`,
        };
      normalized = source.replaceAll(exercise.greeting, "Hello, System!");
    }
    if (exercise.kind === "variable") {
      const call =
        language === "java" ? String.raw`System\.out\.println` : "print";
      const prefix = language === "java" ? String.raw`int\s+` : "";
      const separator =
        language === "java" ? String.raw`\s*;` : String.raw`\s*(?:;|\n)`;
      const ending = language === "java" ? String.raw`\s*;` : String.raw`\s*;?`;
      const shape = new RegExp(
        String.raw`^\s*${prefix}${exercise.variable}\s*=\s*${exercise.value}${separator}\s*${call}\s*\(\s*${exercise.variable}\s*\)${ending}\s*$`,
      );
      if (!shape.test(source))
        return {
          ok: false,
          message: `Assign ${exercise.value} to ${exercise.variable}, then print that variable. This demo supports only the taught statement form.`,
        };
      normalized = source.replace(
        new RegExp(`\\b${exercise.variable}\\b`, "g"),
        "energy",
      );
      normalized = normalized.replace(
        new RegExp(`\\b${exercise.value}\\b`, "g"),
        "10",
      );
    }
    if (exercise.kind === "addition") {
      const call = language === "java" ? "System.out.println" : "print";
      const possibilities = [exercise.solution, ...exercise.alternatives];
      const compact = (text) =>
        language === "java"
          ? text.replace(/\s/g, "")
          : text.replace(/\s/g, "").replace(/;$/, "");
      const ok = possibilities.some(
        (answer) => compact(answer) === compact(source),
      );
      return {
        ok,
        message: ok
          ? `Practice pattern accepted. Expected output: ${exercise.expected}. Code was not executed.`
          : `Expected numeric output ${exercise.expected} from ${call}. Check the current inputs; unsupported valid programs may be rejected.`,
      };
    }
    const result = checkCode(language, exercise.kind, normalized);
    if (result.ok)
      result.message = `Practice pattern accepted. Expected output: ${exercise.expected}. Code was not executed.`;
    return result;
  }
  // Same SELECT-only subset as before, parameterized by authored fixtures, not a full SQL engine.
  const normalizedSql = source.replace(
    /\bwhere\s+(\d+)\s*>\s*([a-z_][a-z_0-9]*)/i,
    "WHERE $2 < $1",
  );
  const match = normalizedSql
    .trim()
    .match(
      /^select\s+([a-z_][a-z_0-9]*(?:\s*,\s*[a-z_][a-z_0-9]*)*|\*)\s+from\s+([a-z_][a-z_0-9]*)(?:\s+where\s+([a-z_][a-z_0-9]*)\s*(<=|>=|<|>|=)\s*(\d+))?\s*;?$/i,
    );
  if (!match || match[2].toLowerCase() !== exercise.table)
    return {
      ok: false,
      message: `Use the displayed ${exercise.table} table. Supported: SELECT column or * FROM table, optionally WHERE column < number. This is not full SQL.`,
    };
  const columns = Object.keys(exercise.rows[0]);
  const selected = match[1].toLowerCase();
  const selectedColumns = selected.split(/\s*,\s*/);
  if (
    selected !== "*" &&
    selectedColumns.some((column) => !columns.includes(column))
  )
    return { ok: false, message: "That column is not in this dataset." };
  let rows = exercise.rows;
  if (match[3]) {
    const column = match[3].toLowerCase();
    if (!columns.includes(column))
      return {
        ok: false,
        message: "The filter column is not in this dataset.",
      };
    rows = rows.filter((row) => {
      const value = row[column],
        threshold = Number(match[5]);
      return {
        "<": value < threshold,
        "<=": value <= threshold,
        ">": value > threshold,
        ">=": value >= threshold,
        "=": value === threshold,
      }[match[4]];
    });
  }
  const allColumns =
    selected === "*" ||
    (selectedColumns.length === columns.length &&
      new Set(selectedColumns).size === columns.length);
  const actual = allColumns
    ? rows
    : selectedColumns.length === 1
      ? rows.map((row) => row[selected])
      : rows.map((row) =>
          Object.fromEntries(
            selectedColumns.map((column) => [column, row[column]]),
          ),
        );
  const ok = JSON.stringify(actual) === JSON.stringify(exercise.expected);
  return {
    ok,
    message:
      (ok
        ? "Objective met."
        : "Query ran, but the returned rows or columns differ from this objective.") +
      "\n" +
      JSON.stringify(actual),
  };
}
