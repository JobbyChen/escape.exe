// Original character-themed practice. These never advance the lesson or grant rewards.
export function skillPrompt(unit, language, stageIndex) {
  const table = unit.skill.id.replaceAll('-', '_');
  const amount = 4 + stageIndex;
  const bonus = 2 + unit.name.length % 5;
  const theme = `${unit.name} is preparing ${unit.skill.name}.`;
  if (language === 'sql') {
    const rows = [{ packet: 1, power: amount }, { packet: 2, power: amount + bonus }];
    const filter = stageIndex >= 2;
    const solution = `SELECT * FROM ${table}${filter ? ` WHERE power > ${amount}` : ''};`;
    return {
      objective: `${theme} Recover ${filter ? `only packets with power greater than ${amount}` : 'all signal packets and columns'} from ${table}.`,
      example: `${table}\n${JSON.stringify(rows)}`,
      table, rows, entry: 'query',
      starter: `SELECT ___ FROM ${table}${filter ? ' WHERE ___' : ''};`,
      solution, tests: [{ expected: (filter ? rows.slice(1) : rows).map(row => [row.packet, row.power]) }],
      hint: filter ? `Use SELECT * and WHERE power > ${amount}.` : 'SELECT * retrieves every column from a table.',
    };
  }
  const advanced = stageIndex >= 4;
  const python = language === 'python';
  const solution = advanced
    ? python ? `def solve(power):\n    return power + ${bonus}` : `static int solve(int power) {\n    return power + ${bonus};\n}`
    : python ? `print(${amount} + ${bonus})` : `System.out.println(${amount} + ${bonus});`;
  return {
    objective: `${theme} ${advanced ? `Write solve(power) to return power plus ${bonus}.` : `Print the combined power of ${amount} base bits plus ${bonus} signal bits.`}`,
    example: `${amount} + ${bonus} → ${amount + bonus}`,
    starter: advanced ? python ? 'def solve(power):\n    return ___' : 'static int solve(int power) {\n    return ___;\n}' : python ? 'print(___)' : 'System.out.println(___);',
    ...(advanced ? {entry: 'solve'} : {}), solution,
    tests: advanced ? [{ args: [amount], expected: amount + bonus }, { args: [0], expected: bonus, hidden: true }, { args: [amount + 9], expected: amount + 9 + bonus, hidden: true }] : [{ expected: String(amount + bonus) }],
    hint: advanced ? `Return power + ${bonus}; do not hard-code the sample result.` : `Use + inside ${python ? 'print(...)' : 'System.out.println(...)'}.`,
  };
}
