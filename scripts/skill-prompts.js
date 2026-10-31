// Original character-themed practice. These never advance the lesson or grant rewards.
const missions = {
  byte: "Rebuild the damaged firewall from recovered shield packets.",
  patch: "Combine repair signals into a healing patch for the party.",
  query: "Recover archive signals to pinpoint the creature's weak index.",
  echo: "Synchronize two signal bursts for a follow-up shot.",
  fern: "Read the trail beacons to prepare a safe route around the next hit.",
  bolt: "Route recovered power into a protective barrier coil.",
  pip: "Prepare a shield delivery for the least-protected companion.",
  rune: "Restore the ward glyphs that protect the whole party.",
  nova: "Combine energy cells to prepare a concentrated burst.",
  atlas: "Recover the load-balancing signals that protect other allies.",
  zero: "Decode a termination signal for a weakened corrupt process.",
  sol: "Restore the dawn signal to heal allies and reboot a fallen companion.",
};
export function skillPrompt(unit, language, stageIndex) {
  const table = unit.skill.id.replaceAll("-", "_");
  const amount = 4 + stageIndex;
  const bonus = 2 + (unit.name.length % 5);
  const theme = `${unit.name} is preparing ${unit.skill.name}. ${missions[unit.id] || ''}`;
  if (language === "sql") {
    const rows = [
      { packet: 1, power: amount },
      { packet: 2, power: amount + bonus },
    ];
    const filter = stageIndex >= 2;
    const solution = `SELECT * FROM ${table}${filter ? ` WHERE power > ${amount}` : ""};`;
    return {
      objective: `${theme} Recover ${filter ? `only packets with power greater than ${amount}` : "all signal packets and columns"} from ${table}.`,
      example: `${table}\n${JSON.stringify(rows)}`,
      table,
      rows,
      entry: "query",
      starter: `SELECT ___ FROM ${table}${filter ? " WHERE ___" : ""};`,
      solution,
      tests: [
        {
          expected: (filter ? rows.slice(1) : rows).map((row) => [
            row.packet,
            row.power,
          ]),
        },
      ],
      hint: filter
        ? `Use SELECT * and WHERE power > ${amount}.`
        : "SELECT * retrieves every column from a table.",
    };
  }
  const advanced = stageIndex >= 4;
  const python = language === "python";
  const solution = advanced
    ? python
      ? `def solve(power):\n    return power + ${bonus}`
      : `static int solve(int power) {\n    return power + ${bonus};\n}`
    : python
      ? `print(${amount} + ${bonus})`
      : `System.out.println(${amount} + ${bonus});`;
  return {
    objective: `${theme} ${advanced ? `Write solve(power) to return power plus ${bonus}.` : `Print the combined power of ${amount} base units plus ${bonus} signal units.`}`,
    example: `${amount} + ${bonus} → ${amount + bonus}`,
    starter: advanced
      ? python
        ? "def solve(power):\n    return ___"
        : "static int solve(int power) {\n    return ___;\n}"
      : python
        ? "print(___)"
        : "System.out.println(___);",
    ...(advanced ? { entry: "solve" } : {}),
    solution,
    tests: advanced
      ? [
          { args: [amount], expected: amount + bonus },
          { args: [0], expected: bonus, hidden: true },
          { args: [amount + 9], expected: amount + 9 + bonus, hidden: true },
        ]
      : [{ expected: String(amount + bonus) }],
    hint: advanced
      ? `Return power + ${bonus}; do not hard-code the sample result.`
      : `Use + inside ${python ? "print(...)" : "System.out.println(...)"}.`,
  };
}
