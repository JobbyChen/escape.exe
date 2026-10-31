import { programmingProblems } from "./programming-problems.js";
import { sqlProblems } from "./sql-problems.js";
const chapters = [
  "First signals",
  "Control flow",
  "Collections and records",
  "Problem solving",
];
export function extendedStages(language) {
  const problems = language === "sql" ? sqlProblems : programmingProblems;
  return problems.map((problem, offset) => {
    const index = offset + 4,
      isBoss = index % 4 === 3;
    const selections = isBoss
      ? [
          problems[offset - 3],
          problems[offset - 2],
          problems[offset - 1],
          problem,
        ]
      : [problem, problem, problem];
    const exercises = selections.map((task, phase) => {
      const order =
        phase % 3 === 0 ? [0, 1, 2] : phase % 3 === 1 ? [3, 4, 5] : [4, 5, 0];
      if (language === "sql")
        return {
          kind: "behavior",
          entry: "query",
          objective: task.objective,
          lesson: task.lesson,
          solution: task.solution,
          workedExample: task.workedExample,
          starter: "-- Write a SELECT query using the schema below.\n",
          fixtures: task.cases[order[0]].fixtures,
          ordered: task.ordered,
          example: JSON.stringify(task.cases[order[0]].fixtures),
          constraints:
            "Read-only SQLite. No required row order unless the question says so. Fixtures may change.",
          tests: order.map((position, i) => ({
            ...task.cases[position],
            hidden: i > 0,
          })),
          hints: [...task.hints, task.solution],
          skills: task.skills,
          alternatives: [task.solution],
          edgeCases: [
            "Changed fixtures",
            "Empty joined groups",
            "Boundary equality",
            "Duplicate relationships",
          ],
          combatEffect:
            "Successful behavior tests power one 20/40/40 combat turn.",
          masterySignal:
            "Evidence on sample and transfer fixtures; full mastery requires later independent review.",
        };
      const params = task.params
        .map(([type, name]) => (language === "java" ? `${type} ${name}` : name))
        .join(", ");
      const starter =
        language === "java"
          ? `public static ${task.returns} solve(${params}) {\n    // Return your result.\n}`
          : `def solve(${params}):\n    # Return your result.\n    pass`;
      return {
        kind: "behavior",
        entry: "solve",
        objective: task.objective,
        lesson: task.lesson,
        constraints:
          task.constraints +
          (language === "python"
            ? " Examples use JSON notation; write True/False in Python."
            : ""),
        solution: task[language],
        starter,
        workedExample: task.workedExamples[language],
        example: `Input: ${JSON.stringify(task.cases[order[0]][0])}\nExpected return: ${JSON.stringify(task.cases[order[0]][1])}`,
        tests: order.map((position, i) => ({
          args: task.cases[position][0],
          expected: task.cases[position][1],
          hidden: i > 0,
        })),
        hints: [...task.hints, task[language]],
        skills: task.skills,
        alternatives: [task[language]],
        edgeCases: task.cases.map((test) => JSON.stringify(test[0])),
        combatEffect:
          "Successful behavior tests power one 20/40/40 combat turn.",
        masterySignal:
          "Generalization to sample and transfer inputs; not completion of the language curriculum.",
      };
    });
    return {
      id: `${language}-${index + 1}`,
      title: problem.title,
      kind: isBoss ? "boss" : "behavior",
      isBoss,
      chapter: Math.floor(index / 4) + 1,
      chapterTitle: (language === "sql"
        ? [
            "First queries",
            "Filtering and summaries",
            "Relationships",
            "Analytical queries",
          ]
        : chapters)[Math.floor(index / 4)],
      difficulty: problem.difficulty,
      skills: problem.skills,
      objective: exercises[0].objective,
      lesson: exercises[0].lesson,
      example: exercises[0].example,
      starter: exercises[0].starter,
      solution: exercises[0].solution,
      exercises,
      enemy: {
        name: isBoss ? "Chapter Guardian" : "NULL challenger",
        hp: exercises.length * 60,
        type: index % 4 >= 2 ? "aoe" : "single",
        attack: isBoss ? 38 : 32,
      },
    };
  });
}
