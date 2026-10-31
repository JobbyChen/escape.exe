import { extendedStages } from "./curriculum/stage-builder.js";
import { lessonExercises } from "./lesson-exercises.js";
// Independent campaign content. New chapters belong here, not in UI code.
const sqlLessons = [
  [
    "The forgotten register",
    "Retrieve every column from enemies.",
    "SELECT chooses columns; FROM names a table. Use * for every column.",
    "SELECT * FROM supplies;",
    "SELECT ___ FROM enemies;",
    "SELECT * FROM enemies;",
    "all",
  ],
  [
    "Names in the static",
    "Retrieve only the name column from enemies.",
    "Replace * with a column name to retrieve only that part of each record.",
    "SELECT item FROM supplies;",
    "SELECT ___ FROM enemies;",
    "SELECT name FROM enemies;",
    "names",
  ],
  [
    "Find the weak point",
    "Retrieve names of enemies with armor below 20.",
    "WHERE filters rows. Below 20 means strictly less than 20; armor 20 does not qualify.",
    "SELECT item FROM supplies WHERE cost < 5;",
    "SELECT name FROM enemies WHERE armor < ___;",
    "SELECT name FROM enemies WHERE armor < 20;",
    "filter",
  ],
  [
    "The Archive Warden",
    "Break two seals: retrieve names, then names with armor below 20.",
    "A boss reviews two concepts. Cast once for each seal. After the first cast, change your query.",
    "Seal 1: names. Seal 2: names WHERE armor < 20.",
    "SELECT name FROM enemies;",
    "SELECT name FROM enemies;",
    "boss",
  ],
];
function languageLessons(java) {
  const print = (value) =>
    java ? `System.out.println(${value});` : `print(${value})`;
  const variable = java
    ? "int energy = 10;\nSystem.out.println(energy);"
    : "energy = 10\nprint(energy)";
  return [
    [
      "Boot sequence",
      "Print Hello, System!",
      "Put text inside matching quotes. " +
        (java
          ? "Java uses double quotes and a semicolon. Write statements inside main; the wrapper is shown below."
          : "print() displays a value."),
      java
        ? "class Main {\n  public static void main(String[] args) {\n    // Your statements go here\n  }\n}"
        : 'print("Hello, traveler!")',
      print('"___"'),
      print('"Hello, System!"'),
      "hello",
    ],
    [
      "Stored energy",
      "Set energy to 10, then print energy.",
      "A variable gives a value a name. " +
        (java ? "Use int for a whole number. " : "") +
        "Print the variable without quotes.",
      java
        ? "int supplies = 4;\nSystem.out.println(supplies);"
        : "supplies = 4\nprint(supplies)",
      variable.replace("10", "___"),
      variable,
      "variable",
    ],
    [
      "Charge the beacon",
      "Print the result of 6 + 4.",
      "Numeric addition uses +. Do not put the expression in quotes.",
      print("3 + 2"),
      print("___ + ___"),
      print("6 + 4"),
      "addition",
    ],
    [
      java ? "The Null Engine" : "The Loop Serpent",
      "Break two seals: print Hello, System!, then set energy to 10 and print it.",
      "Review output and variables. Replace your greeting after the first cast.",
      "Seal 1: greeting. Seal 2: energy variable.",
      print('"Hello, System!"'),
      print('"Hello, System!"'),
      "boss",
    ],
  ];
}
function stages(rows, language) {
  return rows.map(
    ([title, objective, lesson, example, starter, solution, kind], index) => ({
      title,
      objective,
      lesson,
      example,
      starter,
      solution,
      kind,
      isBoss: index === 3,
      chapter: 1,
      chapterTitle: "First signals",
      difficulty: "Beginner",
      exercises: lessonExercises(language, index),
      enemy: {
        name:
          index === 0
            ? "Glitch Slime"
            : index === 3
              ? "Core Guardian"
              : "NULL creature",
        hp: index === 3 ? 240 : 180,
        type: index >= 2 ? "aoe" : "single",
        attack: index === 3 ? 38 : 32,
      },
    }),
  );
}
export const campaigns = [
  {
    id: "sql",
    language: "SQL",
    name: "The Lost Archives",
    core: "MEMORY CORE",
    color: "#f6cf77",
    description:
      "Beneath the dust, every record holds a secret. Recover the data NULL tried to erase.",
    stages: [...stages(sqlLessons, "sql"), ...extendedStages("sql")],
  },
  {
    id: "python",
    language: "Python",
    name: "The Serpent Wilds",
    core: "LOGIC CORE",
    color: "#bcf484",
    description:
      "Lost loops wind through a living jungle. Bring order to the wild, one line at a time.",
    stages: [
      ...stages(languageLessons(false), "python"),
      ...extendedStages("python"),
    ],
  },
  {
    id: "java",
    language: "Java",
    name: "The Machine Citadel",
    core: "EXECUTION CORE",
    color: "#a6c8f5",
    description:
      "Silent engines wait behind iron gates. Reboot the machines and reclaim the citadel.",
    stages: [
      ...stages(languageLessons(true), "java"),
      ...extendedStages("java"),
    ],
  },
];
export const enemies = [
  { id: 1, name: "Glitch", armor: 8, hp: 30 },
  { id: 2, name: "Sentinel", armor: 20, hp: 60 },
  { id: 3, name: "Wisp", armor: 12, hp: 25 },
];
export { characters } from "./characters.js";
