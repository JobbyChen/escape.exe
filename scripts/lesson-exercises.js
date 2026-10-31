// Authored practice variants. Each stage requires every distinct objective in order.
const enemies = [
  { id: 1, name: "Glitch", armor: 8, hp: 30 },
  { id: 2, name: "Sentinel", armor: 20, hp: 60 },
  { id: 3, name: "Wisp", armor: 12, hp: 25 },
];
const fixtures = [
  {
    table: "enemies",
    rows: enemies,
    column: "name",
    filterColumn: "armor",
    threshold: 20,
  },
  {
    table: "supplies",
    rows: [
      { id: 1, item: "Patch kit", quantity: 2 },
      { id: 2, item: "Battery", quantity: 5 },
      { id: 3, item: "Cable", quantity: 3 },
    ],
    column: "item",
    filterColumn: "quantity",
    threshold: 5,
  },
  {
    table: "signals",
    rows: [
      { id: 1, source: "Archive", strength: 25 },
      { id: 2, source: "Citadel", strength: 50 },
      { id: 3, source: "Wilds", strength: 80 },
    ],
    column: "source",
    filterColumn: "strength",
    threshold: 50,
  },
];
export function lessonExercises(language, stageIndex) {
  const kinds =
    stageIndex === 3
      ? ["all", "names", "filter", "filter"]
      : Array(3).fill(["all", "names", "filter"][stageIndex]);
  if (language === "sql")
    return kinds.map((kind, index) => {
      const fixture = fixtures[stageIndex === 3 ? [1, 2, 0, 2][index] : index];
      const fields = kind === "all" ? "*" : fixture.column;
      const where =
        kind === "filter"
          ? ` WHERE ${fixture.filterColumn} < ${fixture.threshold}`
          : "";
      const solution = `SELECT ${fields} FROM ${fixture.table}${where};`;
      return {
        ...fixture,
        kind,
        objective:
          kind === "all"
            ? `Retrieve every column from ${fixture.table}.`
            : kind === "names"
              ? `Retrieve only ${fixture.column} from ${fixture.table}.`
              : `Retrieve ${fixture.column} from ${fixture.table} where ${fixture.filterColumn} is below ${fixture.threshold}.`,
        starter: `SELECT ___ FROM ${fixture.table}${kind === "filter" ? " WHERE ___" : ""};`,
        solution,
        lesson:
          kind === "all"
            ? "SELECT * retrieves all columns; FROM names the table. Apply the same idea to a different table."
            : kind === "names"
              ? "Use the requested column name rather than *. Each table has different columns."
              : "Use WHERE with < to filter rows. A value equal to the boundary must be excluded.",
        example: fixture.table + "\n" + JSON.stringify(fixture.rows),
        expected:
          kind === "all"
            ? fixture.rows
            : fixture.rows
                .filter(
                  (row) =>
                    kind !== "filter" ||
                    row[fixture.filterColumn] < fixture.threshold,
                )
                .map((row) => row[fixture.column]),
        alternatives: [solution.toLowerCase(), solution.replace(";", "")],
        edgeCases: [
          "Empty source",
          "Wrong table",
          "Extra columns",
          "Boundary equal to threshold",
        ],
        hints: ["Check the table and column names in the dataset.", solution],
        combatEffect:
          "20 basic damage, 40 attack-spell damage and 40 utility points at baseline.",
        masterySignal:
          "Practice application to another dataset; not proof of mastery.",
      };
    });
  const java = language === "java";
  const print = (expression) =>
    java ? `System.out.println(${expression});` : `print(${expression})`;
  const tasks =
    stageIndex === 3
      ? ["hello", "variable", "addition", "variable"]
      : Array(3).fill(["hello", "variable", "addition"][stageIndex]);
  return tasks.map((kind, index) => {
    const greeting = [
      "Hello, System!",
      "Archive online",
      "Signal restored",
      "Core restored",
    ][index];
    const variable = ["energy", "shield", "signal", "power"][index];
    const value = [10, 12, 7, 15][index];
    const left = [6, 7, 2, 8][index],
      right = [4, 5, 5, 7][index];
    const solution =
      kind === "hello"
        ? print(JSON.stringify(greeting))
        : kind === "variable"
          ? `${java ? "int " : ""}${variable} = ${value}${java ? ";" : ""}\n${print(variable)}`
          : print(`${left} + ${right}`);
    return {
      kind,
      greeting,
      variable,
      value,
      left,
      right,
      solution,
      objective:
        kind === "hello"
          ? `Print the message ${greeting}.`
          : kind === "variable"
            ? `Set ${variable} to ${value}, then print ${variable}.`
            : `Print the result of ${left} + ${right}.`,
      starter:
        kind === "hello"
          ? print('"___"')
          : kind === "variable"
            ? solution.replace(String(value), "___")
            : print("___ + ___"),
      lesson:
        kind === "hello"
          ? "Put text in matching quotes. Change the message for this example."
          : kind === "variable"
            ? "Assign the requested value to the named variable, then print the variable without quotes."
            : "Add numbers inside the print call, without quotes.",
      example: java
        ? "Write statements inside: class Main { public static void main(String[] args) { /* your code */ } }"
        : "print() displays a value. Assignment uses =.",
      expected:
        kind === "hello"
          ? greeting
          : String(kind === "addition" ? left + right : value),
      alternatives:
        kind === "addition"
          ? [print(`${right} + ${left}`), print(String(left + right))]
          : [solution],
      edgeCases: [
        "Empty source",
        "Wrong output",
        "Quoted variable instead of value",
      ],
      hints: [
        "Check the requested message, variable name, or numeric inputs.",
        solution,
      ],
      combatEffect:
        "20 basic damage, 40 attack-spell damage and 40 utility points at baseline.",
      masterySignal:
        "Introductory runtime-output practice; not proof of independent mastery.",
    };
  });
}
