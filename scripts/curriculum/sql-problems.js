// Original SQL challenges. Expected fixtures authored with trusted SQLite reference queries.
export const sqlProblems = [
  {
    id: "sql-5",
    title: "Boolean targeting",
    objective:
      "Filter enemies with armor below 20 AND hp at least 25; return name and hp.",
    lesson: "Combine conditions with AND; both must hold for the same row.",
    solution: "SELECT name, hp FROM enemies WHERE armor < 20 AND hp >= 25;",
    ordered: false,
    skills: ["WHERE", "AND", "comparison boundaries"],
    difficulty: "Easy",
    cases: [
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 8,
              hp: 30,
              sector_id: 1,
              bounty: 12,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 20,
              hp: 60,
              sector_id: 1,
              bounty: 35,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 12,
              hp: 25,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 5,
              hp: 18,
              sector_id: 2,
              bounty: 18,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 35,
              hp: 90,
              sector_id: 3,
              bounty: 50,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [
          ["Glitch", 30],
          ["Wisp", 25],
        ],
      },
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 9,
              hp: 37,
              sector_id: 1,
              bounty: 13,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 21,
              hp: 67,
              sector_id: 1,
              bounty: 37,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 13,
              hp: 32,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 6,
              hp: 25,
              sector_id: 2,
              bounty: 19,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 36,
              hp: 97,
              sector_id: 3,
              bounty: 52,
            },
            {
              id: 6,
              name: "Transfer Ghost",
              armor: 19,
              hp: 25,
              sector_id: 4,
              bounty: 35,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [
          ["Glitch", 37],
          ["Wisp", 32],
          ["Null Bat", 25],
          ["Transfer Ghost", 25],
        ],
      },
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 10,
              hp: 44,
              sector_id: 1,
              bounty: 14,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 22,
              hp: 74,
              sector_id: 1,
              bounty: 39,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 14,
              hp: 39,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 7,
              hp: 32,
              sector_id: 2,
              bounty: 20,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 37,
              hp: 104,
              sector_id: 3,
              bounty: 54,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [
          ["Glitch", 44],
          ["Wisp", 39],
          ["Null Bat", 32],
        ],
      },
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 11,
              hp: 51,
              sector_id: 1,
              bounty: 15,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 23,
              hp: 81,
              sector_id: 1,
              bounty: 41,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 15,
              hp: 46,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 8,
              hp: 39,
              sector_id: 2,
              bounty: 21,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 38,
              hp: 111,
              sector_id: 3,
              bounty: 56,
            },
            {
              id: 6,
              name: "Transfer Ghost",
              armor: 19,
              hp: 25,
              sector_id: 4,
              bounty: 35,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [
          ["Glitch", 51],
          ["Wisp", 46],
          ["Null Bat", 39],
          ["Transfer Ghost", 25],
        ],
      },
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 12,
              hp: 58,
              sector_id: 1,
              bounty: 16,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 24,
              hp: 88,
              sector_id: 1,
              bounty: 43,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 16,
              hp: 53,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 9,
              hp: 46,
              sector_id: 2,
              bounty: 22,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 39,
              hp: 118,
              sector_id: 3,
              bounty: 58,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [
          ["Glitch", 58],
          ["Wisp", 53],
          ["Null Bat", 46],
        ],
      },
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 13,
              hp: 65,
              sector_id: 1,
              bounty: 17,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 25,
              hp: 95,
              sector_id: 1,
              bounty: 45,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 17,
              hp: 60,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 10,
              hp: 53,
              sector_id: 2,
              bounty: 23,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 40,
              hp: 125,
              sector_id: 3,
              bounty: 60,
            },
            {
              id: 6,
              name: "Transfer Ghost",
              armor: 19,
              hp: 25,
              sector_id: 4,
              bounty: 35,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [
          ["Glitch", 65],
          ["Wisp", 60],
          ["Null Bat", 53],
          ["Transfer Ghost", 25],
        ],
      },
    ],
    hints: [
      "Use the schema and think about which rows must survive each query step.",
      "Check empty groups, boundary values and data changes before hard-coding constants.",
    ],
    workedExample: "SELECT name\nFROM enemies\nWHERE hp > 20 AND armor <= 10;",
  },
  {
    id: "sql-6",
    title: "Threat ranking",
    objective:
      "Return the three highest-bounty enemies as name and bounty, highest bounty first. Break ties by id ascending.",
    lesson:
      "ORDER BY can combine a primary sort and a stable tie-breaker. LIMIT is applied after sorting.",
    solution:
      "SELECT name, bounty FROM enemies ORDER BY bounty DESC, id ASC LIMIT 3;",
    ordered: true,
    skills: ["ORDER BY", "LIMIT", "ties"],
    difficulty: "Easy",
    cases: [
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 8,
              hp: 30,
              sector_id: 1,
              bounty: 12,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 20,
              hp: 60,
              sector_id: 1,
              bounty: 35,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 12,
              hp: 25,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 5,
              hp: 18,
              sector_id: 2,
              bounty: 18,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 35,
              hp: 90,
              sector_id: 3,
              bounty: 50,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [
          ["Iron Maw", 50],
          ["Sentinel", 35],
          ["Null Bat", 18],
        ],
      },
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 9,
              hp: 37,
              sector_id: 1,
              bounty: 13,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 21,
              hp: 67,
              sector_id: 1,
              bounty: 37,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 13,
              hp: 32,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 6,
              hp: 25,
              sector_id: 2,
              bounty: 19,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 36,
              hp: 97,
              sector_id: 3,
              bounty: 52,
            },
            {
              id: 6,
              name: "Transfer Ghost",
              armor: 19,
              hp: 25,
              sector_id: 4,
              bounty: 35,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [
          ["Iron Maw", 52],
          ["Sentinel", 37],
          ["Transfer Ghost", 35],
        ],
      },
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 10,
              hp: 44,
              sector_id: 1,
              bounty: 14,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 22,
              hp: 74,
              sector_id: 1,
              bounty: 39,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 14,
              hp: 39,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 7,
              hp: 32,
              sector_id: 2,
              bounty: 20,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 37,
              hp: 104,
              sector_id: 3,
              bounty: 54,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [
          ["Iron Maw", 54],
          ["Sentinel", 39],
          ["Null Bat", 20],
        ],
      },
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 11,
              hp: 51,
              sector_id: 1,
              bounty: 15,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 23,
              hp: 81,
              sector_id: 1,
              bounty: 41,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 15,
              hp: 46,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 8,
              hp: 39,
              sector_id: 2,
              bounty: 21,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 38,
              hp: 111,
              sector_id: 3,
              bounty: 56,
            },
            {
              id: 6,
              name: "Transfer Ghost",
              armor: 19,
              hp: 25,
              sector_id: 4,
              bounty: 35,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [
          ["Iron Maw", 56],
          ["Sentinel", 41],
          ["Transfer Ghost", 35],
        ],
      },
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 12,
              hp: 58,
              sector_id: 1,
              bounty: 16,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 24,
              hp: 88,
              sector_id: 1,
              bounty: 43,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 16,
              hp: 53,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 9,
              hp: 46,
              sector_id: 2,
              bounty: 22,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 39,
              hp: 118,
              sector_id: 3,
              bounty: 58,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [
          ["Iron Maw", 58],
          ["Sentinel", 43],
          ["Null Bat", 22],
        ],
      },
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 13,
              hp: 65,
              sector_id: 1,
              bounty: 17,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 25,
              hp: 95,
              sector_id: 1,
              bounty: 45,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 17,
              hp: 60,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 10,
              hp: 53,
              sector_id: 2,
              bounty: 23,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 40,
              hp: 125,
              sector_id: 3,
              bounty: 60,
            },
            {
              id: 6,
              name: "Transfer Ghost",
              armor: 19,
              hp: 25,
              sector_id: 4,
              bounty: 35,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [
          ["Iron Maw", 60],
          ["Sentinel", 45],
          ["Transfer Ghost", 35],
        ],
      },
    ],
    hints: [
      "Use the schema and think about which rows must survive each query step.",
      "Check empty groups, boundary values and data changes before hard-coding constants.",
    ],
    workedExample: "SELECT id, hp\nFROM enemies\nORDER BY hp ASC\nLIMIT 2;",
  },
  {
    id: "sql-7",
    title: "Resource audit",
    objective:
      "Return total enemy count as enemy_count and total bounty as total_bounty.",
    lesson:
      "COUNT(*) counts rows. SUM combines numeric values; aggregate queries reduce many rows to a summary.",
    solution:
      "SELECT COUNT(*) AS enemy_count, SUM(bounty) AS total_bounty FROM enemies;",
    ordered: false,
    skills: ["COUNT", "SUM", "aggregation"],
    difficulty: "Easy",
    cases: [
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 8,
              hp: 30,
              sector_id: 1,
              bounty: 12,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 20,
              hp: 60,
              sector_id: 1,
              bounty: 35,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 12,
              hp: 25,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 5,
              hp: 18,
              sector_id: 2,
              bounty: 18,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 35,
              hp: 90,
              sector_id: 3,
              bounty: 50,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [[5, 124]],
      },
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 9,
              hp: 37,
              sector_id: 1,
              bounty: 13,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 21,
              hp: 67,
              sector_id: 1,
              bounty: 37,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 13,
              hp: 32,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 6,
              hp: 25,
              sector_id: 2,
              bounty: 19,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 36,
              hp: 97,
              sector_id: 3,
              bounty: 52,
            },
            {
              id: 6,
              name: "Transfer Ghost",
              armor: 19,
              hp: 25,
              sector_id: 4,
              bounty: 35,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [[6, 165]],
      },
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 10,
              hp: 44,
              sector_id: 1,
              bounty: 14,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 22,
              hp: 74,
              sector_id: 1,
              bounty: 39,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 14,
              hp: 39,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 7,
              hp: 32,
              sector_id: 2,
              bounty: 20,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 37,
              hp: 104,
              sector_id: 3,
              bounty: 54,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [[5, 136]],
      },
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 11,
              hp: 51,
              sector_id: 1,
              bounty: 15,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 23,
              hp: 81,
              sector_id: 1,
              bounty: 41,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 15,
              hp: 46,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 8,
              hp: 39,
              sector_id: 2,
              bounty: 21,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 38,
              hp: 111,
              sector_id: 3,
              bounty: 56,
            },
            {
              id: 6,
              name: "Transfer Ghost",
              armor: 19,
              hp: 25,
              sector_id: 4,
              bounty: 35,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [[6, 177]],
      },
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 12,
              hp: 58,
              sector_id: 1,
              bounty: 16,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 24,
              hp: 88,
              sector_id: 1,
              bounty: 43,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 16,
              hp: 53,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 9,
              hp: 46,
              sector_id: 2,
              bounty: 22,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 39,
              hp: 118,
              sector_id: 3,
              bounty: 58,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [[5, 148]],
      },
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 13,
              hp: 65,
              sector_id: 1,
              bounty: 17,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 25,
              hp: 95,
              sector_id: 1,
              bounty: 45,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 17,
              hp: 60,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 10,
              hp: 53,
              sector_id: 2,
              bounty: 23,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 40,
              hp: 125,
              sector_id: 3,
              bounty: 60,
            },
            {
              id: 6,
              name: "Transfer Ghost",
              armor: 19,
              hp: 25,
              sector_id: 4,
              bounty: 35,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [[6, 189]],
      },
    ],
    hints: [
      "Use the schema and think about which rows must survive each query step.",
      "Check empty groups, boundary values and data changes before hard-coding constants.",
    ],
    workedExample: "SELECT COUNT(*) AS row_count\nFROM enemies;",
  },
  {
    id: "sql-8",
    title: "Sector checkpoint",
    objective:
      "Return sector_id and total bounty for each sector containing at least two enemies.",
    lesson:
      "GROUP BY creates groups. HAVING filters group summaries rather than individual rows.",
    solution:
      "SELECT sector_id, SUM(bounty) AS total_bounty FROM enemies GROUP BY sector_id HAVING COUNT(*) >= 2;",
    ordered: false,
    skills: ["GROUP BY", "HAVING", "review"],
    difficulty: "Medium",
    cases: [
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 8,
              hp: 30,
              sector_id: 1,
              bounty: 12,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 20,
              hp: 60,
              sector_id: 1,
              bounty: 35,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 12,
              hp: 25,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 5,
              hp: 18,
              sector_id: 2,
              bounty: 18,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 35,
              hp: 90,
              sector_id: 3,
              bounty: 50,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [
          [1, 47],
          [2, 27],
        ],
      },
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 9,
              hp: 37,
              sector_id: 1,
              bounty: 13,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 21,
              hp: 67,
              sector_id: 1,
              bounty: 37,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 13,
              hp: 32,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 6,
              hp: 25,
              sector_id: 2,
              bounty: 19,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 36,
              hp: 97,
              sector_id: 3,
              bounty: 52,
            },
            {
              id: 6,
              name: "Transfer Ghost",
              armor: 19,
              hp: 25,
              sector_id: 4,
              bounty: 35,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [
          [1, 50],
          [2, 28],
        ],
      },
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 10,
              hp: 44,
              sector_id: 1,
              bounty: 14,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 22,
              hp: 74,
              sector_id: 1,
              bounty: 39,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 14,
              hp: 39,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 7,
              hp: 32,
              sector_id: 2,
              bounty: 20,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 37,
              hp: 104,
              sector_id: 3,
              bounty: 54,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [
          [1, 53],
          [2, 29],
        ],
      },
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 11,
              hp: 51,
              sector_id: 1,
              bounty: 15,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 23,
              hp: 81,
              sector_id: 1,
              bounty: 41,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 15,
              hp: 46,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 8,
              hp: 39,
              sector_id: 2,
              bounty: 21,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 38,
              hp: 111,
              sector_id: 3,
              bounty: 56,
            },
            {
              id: 6,
              name: "Transfer Ghost",
              armor: 19,
              hp: 25,
              sector_id: 4,
              bounty: 35,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [
          [1, 56],
          [2, 30],
        ],
      },
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 12,
              hp: 58,
              sector_id: 1,
              bounty: 16,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 24,
              hp: 88,
              sector_id: 1,
              bounty: 43,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 16,
              hp: 53,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 9,
              hp: 46,
              sector_id: 2,
              bounty: 22,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 39,
              hp: 118,
              sector_id: 3,
              bounty: 58,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [
          [1, 59],
          [2, 31],
        ],
      },
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 13,
              hp: 65,
              sector_id: 1,
              bounty: 17,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 25,
              hp: 95,
              sector_id: 1,
              bounty: 45,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 17,
              hp: 60,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 10,
              hp: 53,
              sector_id: 2,
              bounty: 23,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 40,
              hp: 125,
              sector_id: 3,
              bounty: 60,
            },
            {
              id: 6,
              name: "Transfer Ghost",
              armor: 19,
              hp: 25,
              sector_id: 4,
              bounty: 35,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [
          [1, 62],
          [2, 32],
        ],
      },
    ],
    hints: [
      "Use the schema and think about which rows must survive each query step.",
      "Check empty groups, boundary values and data changes before hard-coding constants.",
    ],
    workedExample:
      "SELECT sector_id, COUNT(*) AS amount\nFROM enemies\nGROUP BY sector_id\nHAVING COUNT(*) > 1;",
  },
  {
    id: "sql-9",
    title: "Reconnect the archives",
    objective:
      "Return every enemy name and its sector name, using aliases enemy and sector.",
    lesson:
      "An INNER JOIN matches rows through the sector_id foreign key and sector primary key.",
    solution:
      "SELECT e.name AS enemy, s.name AS sector FROM enemies e JOIN sectors s ON e.sector_id = s.id;",
    ordered: false,
    skills: ["INNER JOIN", "aliases", "keys"],
    difficulty: "Medium",
    cases: [
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 8,
              hp: 30,
              sector_id: 1,
              bounty: 12,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 20,
              hp: 60,
              sector_id: 1,
              bounty: 35,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 12,
              hp: 25,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 5,
              hp: 18,
              sector_id: 2,
              bounty: 18,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 35,
              hp: 90,
              sector_id: 3,
              bounty: 50,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [
          ["Glitch", "Archives"],
          ["Sentinel", "Archives"],
          ["Wisp", "Wilds"],
          ["Null Bat", "Wilds"],
          ["Iron Maw", "Citadel"],
        ],
      },
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 9,
              hp: 37,
              sector_id: 1,
              bounty: 13,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 21,
              hp: 67,
              sector_id: 1,
              bounty: 37,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 13,
              hp: 32,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 6,
              hp: 25,
              sector_id: 2,
              bounty: 19,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 36,
              hp: 97,
              sector_id: 3,
              bounty: 52,
            },
            {
              id: 6,
              name: "Transfer Ghost",
              armor: 19,
              hp: 25,
              sector_id: 4,
              bounty: 35,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [
          ["Glitch", "Archives"],
          ["Sentinel", "Archives"],
          ["Wisp", "Wilds"],
          ["Null Bat", "Wilds"],
          ["Iron Maw", "Citadel"],
          ["Transfer Ghost", "Dormant"],
        ],
      },
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 10,
              hp: 44,
              sector_id: 1,
              bounty: 14,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 22,
              hp: 74,
              sector_id: 1,
              bounty: 39,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 14,
              hp: 39,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 7,
              hp: 32,
              sector_id: 2,
              bounty: 20,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 37,
              hp: 104,
              sector_id: 3,
              bounty: 54,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [
          ["Glitch", "Archives"],
          ["Sentinel", "Archives"],
          ["Wisp", "Wilds"],
          ["Null Bat", "Wilds"],
          ["Iron Maw", "Citadel"],
        ],
      },
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 11,
              hp: 51,
              sector_id: 1,
              bounty: 15,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 23,
              hp: 81,
              sector_id: 1,
              bounty: 41,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 15,
              hp: 46,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 8,
              hp: 39,
              sector_id: 2,
              bounty: 21,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 38,
              hp: 111,
              sector_id: 3,
              bounty: 56,
            },
            {
              id: 6,
              name: "Transfer Ghost",
              armor: 19,
              hp: 25,
              sector_id: 4,
              bounty: 35,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [
          ["Glitch", "Archives"],
          ["Sentinel", "Archives"],
          ["Wisp", "Wilds"],
          ["Null Bat", "Wilds"],
          ["Iron Maw", "Citadel"],
          ["Transfer Ghost", "Dormant"],
        ],
      },
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 12,
              hp: 58,
              sector_id: 1,
              bounty: 16,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 24,
              hp: 88,
              sector_id: 1,
              bounty: 43,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 16,
              hp: 53,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 9,
              hp: 46,
              sector_id: 2,
              bounty: 22,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 39,
              hp: 118,
              sector_id: 3,
              bounty: 58,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [
          ["Glitch", "Archives"],
          ["Sentinel", "Archives"],
          ["Wisp", "Wilds"],
          ["Null Bat", "Wilds"],
          ["Iron Maw", "Citadel"],
        ],
      },
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 13,
              hp: 65,
              sector_id: 1,
              bounty: 17,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 25,
              hp: 95,
              sector_id: 1,
              bounty: 45,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 17,
              hp: 60,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 10,
              hp: 53,
              sector_id: 2,
              bounty: 23,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 40,
              hp: 125,
              sector_id: 3,
              bounty: 60,
            },
            {
              id: 6,
              name: "Transfer Ghost",
              armor: 19,
              hp: 25,
              sector_id: 4,
              bounty: 35,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [
          ["Glitch", "Archives"],
          ["Sentinel", "Archives"],
          ["Wisp", "Wilds"],
          ["Null Bat", "Wilds"],
          ["Iron Maw", "Citadel"],
          ["Transfer Ghost", "Dormant"],
        ],
      },
    ],
    hints: [
      "Use the schema and think about which rows must survive each query step.",
      "Check empty groups, boundary values and data changes before hard-coding constants.",
    ],
    workedExample:
      "SELECT e.id, s.name\nFROM enemies AS e\nJOIN sectors AS s ON e.sector_id = s.id;",
  },
  {
    id: "sql-10",
    title: "Recover empty sectors",
    objective:
      "Return every sector name and its enemy count, including empty sectors.",
    lesson:
      "A LEFT JOIN keeps unmatched left rows. COUNT(e.id), unlike COUNT(*), excludes missing right-side ids.",
    solution:
      "SELECT s.name, COUNT(e.id) AS enemy_count FROM sectors s LEFT JOIN enemies e ON s.id = e.sector_id GROUP BY s.id, s.name;",
    ordered: false,
    skills: ["LEFT JOIN", "NULL", "counting"],
    difficulty: "Medium",
    cases: [
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 8,
              hp: 30,
              sector_id: 1,
              bounty: 12,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 20,
              hp: 60,
              sector_id: 1,
              bounty: 35,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 12,
              hp: 25,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 5,
              hp: 18,
              sector_id: 2,
              bounty: 18,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 35,
              hp: 90,
              sector_id: 3,
              bounty: 50,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [
          ["Archives", 2],
          ["Wilds", 2],
          ["Citadel", 1],
          ["Dormant", 0],
        ],
      },
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 9,
              hp: 37,
              sector_id: 1,
              bounty: 13,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 21,
              hp: 67,
              sector_id: 1,
              bounty: 37,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 13,
              hp: 32,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 6,
              hp: 25,
              sector_id: 2,
              bounty: 19,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 36,
              hp: 97,
              sector_id: 3,
              bounty: 52,
            },
            {
              id: 6,
              name: "Transfer Ghost",
              armor: 19,
              hp: 25,
              sector_id: 4,
              bounty: 35,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [
          ["Archives", 2],
          ["Wilds", 2],
          ["Citadel", 1],
          ["Dormant", 1],
        ],
      },
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 10,
              hp: 44,
              sector_id: 1,
              bounty: 14,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 22,
              hp: 74,
              sector_id: 1,
              bounty: 39,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 14,
              hp: 39,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 7,
              hp: 32,
              sector_id: 2,
              bounty: 20,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 37,
              hp: 104,
              sector_id: 3,
              bounty: 54,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [
          ["Archives", 2],
          ["Wilds", 2],
          ["Citadel", 1],
          ["Dormant", 0],
        ],
      },
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 11,
              hp: 51,
              sector_id: 1,
              bounty: 15,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 23,
              hp: 81,
              sector_id: 1,
              bounty: 41,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 15,
              hp: 46,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 8,
              hp: 39,
              sector_id: 2,
              bounty: 21,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 38,
              hp: 111,
              sector_id: 3,
              bounty: 56,
            },
            {
              id: 6,
              name: "Transfer Ghost",
              armor: 19,
              hp: 25,
              sector_id: 4,
              bounty: 35,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [
          ["Archives", 2],
          ["Wilds", 2],
          ["Citadel", 1],
          ["Dormant", 1],
        ],
      },
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 12,
              hp: 58,
              sector_id: 1,
              bounty: 16,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 24,
              hp: 88,
              sector_id: 1,
              bounty: 43,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 16,
              hp: 53,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 9,
              hp: 46,
              sector_id: 2,
              bounty: 22,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 39,
              hp: 118,
              sector_id: 3,
              bounty: 58,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [
          ["Archives", 2],
          ["Wilds", 2],
          ["Citadel", 1],
          ["Dormant", 0],
        ],
      },
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 13,
              hp: 65,
              sector_id: 1,
              bounty: 17,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 25,
              hp: 95,
              sector_id: 1,
              bounty: 45,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 17,
              hp: 60,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 10,
              hp: 53,
              sector_id: 2,
              bounty: 23,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 40,
              hp: 125,
              sector_id: 3,
              bounty: 60,
            },
            {
              id: 6,
              name: "Transfer Ghost",
              armor: 19,
              hp: 25,
              sector_id: 4,
              bounty: 35,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [
          ["Archives", 2],
          ["Wilds", 2],
          ["Citadel", 1],
          ["Dormant", 1],
        ],
      },
    ],
    hints: [
      "Use the schema and think about which rows must survive each query step.",
      "Check empty groups, boundary values and data changes before hard-coding constants.",
    ],
    workedExample:
      "SELECT s.id, e.name\nFROM sectors AS s\nLEFT JOIN enemies AS e ON e.sector_id = s.id;",
  },
  {
    id: "sql-11",
    title: "Grouped threat analysis",
    objective:
      "For each occupied sector, return sector_id and average hp, but only groups whose average hp exceeds 35.",
    lesson:
      "WHERE acts before aggregation; HAVING tests the grouped average. Avoid rounding unless requested.",
    solution:
      "SELECT sector_id, AVG(hp) AS average_hp FROM enemies GROUP BY sector_id HAVING AVG(hp) > 35;",
    ordered: false,
    skills: ["AVG", "GROUP BY", "HAVING"],
    difficulty: "Medium",
    cases: [
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 8,
              hp: 30,
              sector_id: 1,
              bounty: 12,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 20,
              hp: 60,
              sector_id: 1,
              bounty: 35,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 12,
              hp: 25,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 5,
              hp: 18,
              sector_id: 2,
              bounty: 18,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 35,
              hp: 90,
              sector_id: 3,
              bounty: 50,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [
          [1, 45.0],
          [3, 90.0],
        ],
      },
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 9,
              hp: 37,
              sector_id: 1,
              bounty: 13,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 21,
              hp: 67,
              sector_id: 1,
              bounty: 37,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 13,
              hp: 32,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 6,
              hp: 25,
              sector_id: 2,
              bounty: 19,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 36,
              hp: 97,
              sector_id: 3,
              bounty: 52,
            },
            {
              id: 6,
              name: "Transfer Ghost",
              armor: 19,
              hp: 25,
              sector_id: 4,
              bounty: 35,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [
          [1, 52.0],
          [3, 97.0],
        ],
      },
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 10,
              hp: 44,
              sector_id: 1,
              bounty: 14,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 22,
              hp: 74,
              sector_id: 1,
              bounty: 39,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 14,
              hp: 39,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 7,
              hp: 32,
              sector_id: 2,
              bounty: 20,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 37,
              hp: 104,
              sector_id: 3,
              bounty: 54,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [
          [1, 59.0],
          [2, 35.5],
          [3, 104.0],
        ],
      },
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 11,
              hp: 51,
              sector_id: 1,
              bounty: 15,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 23,
              hp: 81,
              sector_id: 1,
              bounty: 41,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 15,
              hp: 46,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 8,
              hp: 39,
              sector_id: 2,
              bounty: 21,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 38,
              hp: 111,
              sector_id: 3,
              bounty: 56,
            },
            {
              id: 6,
              name: "Transfer Ghost",
              armor: 19,
              hp: 25,
              sector_id: 4,
              bounty: 35,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [
          [1, 66.0],
          [2, 42.5],
          [3, 111.0],
        ],
      },
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 12,
              hp: 58,
              sector_id: 1,
              bounty: 16,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 24,
              hp: 88,
              sector_id: 1,
              bounty: 43,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 16,
              hp: 53,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 9,
              hp: 46,
              sector_id: 2,
              bounty: 22,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 39,
              hp: 118,
              sector_id: 3,
              bounty: 58,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [
          [1, 73.0],
          [2, 49.5],
          [3, 118.0],
        ],
      },
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 13,
              hp: 65,
              sector_id: 1,
              bounty: 17,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 25,
              hp: 95,
              sector_id: 1,
              bounty: 45,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 17,
              hp: 60,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 10,
              hp: 53,
              sector_id: 2,
              bounty: 23,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 40,
              hp: 125,
              sector_id: 3,
              bounty: 60,
            },
            {
              id: 6,
              name: "Transfer Ghost",
              armor: 19,
              hp: 25,
              sector_id: 4,
              bounty: 35,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [
          [1, 80.0],
          [2, 56.5],
          [3, 125.0],
        ],
      },
    ],
    hints: [
      "Use the schema and think about which rows must survive each query step.",
      "Check empty groups, boundary values and data changes before hard-coding constants.",
    ],
    workedExample:
      "SELECT sector_id, AVG(bounty) AS mean_bounty\nFROM enemies\nGROUP BY sector_id;",
  },
  {
    id: "sql-12",
    title: "Relational checkpoint",
    objective:
      "Return sector name and total bounty, including zero for empty sectors.",
    lesson:
      "Combine LEFT JOIN, grouping and COALESCE so missing aggregates become zero.",
    solution:
      "SELECT s.name, COALESCE(SUM(e.bounty), 0) AS total_bounty FROM sectors s LEFT JOIN enemies e ON e.sector_id = s.id GROUP BY s.id, s.name;",
    ordered: false,
    skills: ["joins", "COALESCE", "mixed review"],
    difficulty: "Medium",
    cases: [
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 8,
              hp: 30,
              sector_id: 1,
              bounty: 12,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 20,
              hp: 60,
              sector_id: 1,
              bounty: 35,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 12,
              hp: 25,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 5,
              hp: 18,
              sector_id: 2,
              bounty: 18,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 35,
              hp: 90,
              sector_id: 3,
              bounty: 50,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [
          ["Archives", 47],
          ["Wilds", 27],
          ["Citadel", 50],
          ["Dormant", 0],
        ],
      },
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 9,
              hp: 37,
              sector_id: 1,
              bounty: 13,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 21,
              hp: 67,
              sector_id: 1,
              bounty: 37,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 13,
              hp: 32,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 6,
              hp: 25,
              sector_id: 2,
              bounty: 19,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 36,
              hp: 97,
              sector_id: 3,
              bounty: 52,
            },
            {
              id: 6,
              name: "Transfer Ghost",
              armor: 19,
              hp: 25,
              sector_id: 4,
              bounty: 35,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [
          ["Archives", 50],
          ["Wilds", 28],
          ["Citadel", 52],
          ["Dormant", 35],
        ],
      },
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 10,
              hp: 44,
              sector_id: 1,
              bounty: 14,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 22,
              hp: 74,
              sector_id: 1,
              bounty: 39,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 14,
              hp: 39,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 7,
              hp: 32,
              sector_id: 2,
              bounty: 20,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 37,
              hp: 104,
              sector_id: 3,
              bounty: 54,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [
          ["Archives", 53],
          ["Wilds", 29],
          ["Citadel", 54],
          ["Dormant", 0],
        ],
      },
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 11,
              hp: 51,
              sector_id: 1,
              bounty: 15,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 23,
              hp: 81,
              sector_id: 1,
              bounty: 41,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 15,
              hp: 46,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 8,
              hp: 39,
              sector_id: 2,
              bounty: 21,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 38,
              hp: 111,
              sector_id: 3,
              bounty: 56,
            },
            {
              id: 6,
              name: "Transfer Ghost",
              armor: 19,
              hp: 25,
              sector_id: 4,
              bounty: 35,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [
          ["Archives", 56],
          ["Wilds", 30],
          ["Citadel", 56],
          ["Dormant", 35],
        ],
      },
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 12,
              hp: 58,
              sector_id: 1,
              bounty: 16,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 24,
              hp: 88,
              sector_id: 1,
              bounty: 43,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 16,
              hp: 53,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 9,
              hp: 46,
              sector_id: 2,
              bounty: 22,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 39,
              hp: 118,
              sector_id: 3,
              bounty: 58,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [
          ["Archives", 59],
          ["Wilds", 31],
          ["Citadel", 58],
          ["Dormant", 0],
        ],
      },
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 13,
              hp: 65,
              sector_id: 1,
              bounty: 17,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 25,
              hp: 95,
              sector_id: 1,
              bounty: 45,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 17,
              hp: 60,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 10,
              hp: 53,
              sector_id: 2,
              bounty: 23,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 40,
              hp: 125,
              sector_id: 3,
              bounty: 60,
            },
            {
              id: 6,
              name: "Transfer Ghost",
              armor: 19,
              hp: 25,
              sector_id: 4,
              bounty: 35,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [
          ["Archives", 62],
          ["Wilds", 32],
          ["Citadel", 60],
          ["Dormant", 35],
        ],
      },
    ],
    hints: [
      "Use the schema and think about which rows must survive each query step.",
      "Check empty groups, boundary values and data changes before hard-coding constants.",
    ],
    workedExample: "SELECT COALESCE(NULL, 0) AS safe_value;",
  },
  {
    id: "sql-13",
    title: "Above-average anomalies",
    objective:
      "Return names of enemies whose hp exceeds the overall average hp.",
    lesson:
      "A scalar subquery can compute the threshold from data rather than hard-coding the visible average.",
    solution:
      "SELECT name FROM enemies WHERE hp > (SELECT AVG(hp) FROM enemies);",
    ordered: false,
    skills: ["subqueries", "data-derived thresholds"],
    difficulty: "Medium",
    cases: [
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 8,
              hp: 30,
              sector_id: 1,
              bounty: 12,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 20,
              hp: 60,
              sector_id: 1,
              bounty: 35,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 12,
              hp: 25,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 5,
              hp: 18,
              sector_id: 2,
              bounty: 18,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 35,
              hp: 90,
              sector_id: 3,
              bounty: 50,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [["Sentinel"], ["Iron Maw"]],
      },
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 9,
              hp: 37,
              sector_id: 1,
              bounty: 13,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 21,
              hp: 67,
              sector_id: 1,
              bounty: 37,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 13,
              hp: 32,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 6,
              hp: 25,
              sector_id: 2,
              bounty: 19,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 36,
              hp: 97,
              sector_id: 3,
              bounty: 52,
            },
            {
              id: 6,
              name: "Transfer Ghost",
              armor: 19,
              hp: 25,
              sector_id: 4,
              bounty: 35,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [["Sentinel"], ["Iron Maw"]],
      },
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 10,
              hp: 44,
              sector_id: 1,
              bounty: 14,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 22,
              hp: 74,
              sector_id: 1,
              bounty: 39,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 14,
              hp: 39,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 7,
              hp: 32,
              sector_id: 2,
              bounty: 20,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 37,
              hp: 104,
              sector_id: 3,
              bounty: 54,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [["Sentinel"], ["Iron Maw"]],
      },
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 11,
              hp: 51,
              sector_id: 1,
              bounty: 15,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 23,
              hp: 81,
              sector_id: 1,
              bounty: 41,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 15,
              hp: 46,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 8,
              hp: 39,
              sector_id: 2,
              bounty: 21,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 38,
              hp: 111,
              sector_id: 3,
              bounty: 56,
            },
            {
              id: 6,
              name: "Transfer Ghost",
              armor: 19,
              hp: 25,
              sector_id: 4,
              bounty: 35,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [["Sentinel"], ["Iron Maw"]],
      },
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 12,
              hp: 58,
              sector_id: 1,
              bounty: 16,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 24,
              hp: 88,
              sector_id: 1,
              bounty: 43,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 16,
              hp: 53,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 9,
              hp: 46,
              sector_id: 2,
              bounty: 22,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 39,
              hp: 118,
              sector_id: 3,
              bounty: 58,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [["Sentinel"], ["Iron Maw"]],
      },
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 13,
              hp: 65,
              sector_id: 1,
              bounty: 17,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 25,
              hp: 95,
              sector_id: 1,
              bounty: 45,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 17,
              hp: 60,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 10,
              hp: 53,
              sector_id: 2,
              bounty: 23,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 40,
              hp: 125,
              sector_id: 3,
              bounty: 60,
            },
            {
              id: 6,
              name: "Transfer Ghost",
              armor: 19,
              hp: 25,
              sector_id: 4,
              bounty: 35,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [["Sentinel"], ["Iron Maw"]],
      },
    ],
    hints: [
      "Use the schema and think about which rows must survive each query step.",
      "Check empty groups, boundary values and data changes before hard-coding constants.",
    ],
    workedExample:
      "SELECT name\nFROM enemies\nWHERE bounty > (SELECT AVG(bounty) FROM enemies);",
  },
  {
    id: "sql-14",
    title: "Rebuild a sector report",
    objective:
      "Use any valid query to return sector_id and total bounty for sectors whose total bounty is at least 30.",
    lesson:
      "A CTE names an intermediate result. It can make a multi-step aggregate report easier to reason about.",
    solution:
      "WITH totals AS (SELECT sector_id, SUM(bounty) AS total FROM enemies GROUP BY sector_id) SELECT sector_id, total FROM totals WHERE total >= 30;",
    ordered: false,
    skills: ["CTEs", "aggregation", "decomposition"],
    difficulty: "Medium",
    cases: [
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 8,
              hp: 30,
              sector_id: 1,
              bounty: 12,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 20,
              hp: 60,
              sector_id: 1,
              bounty: 35,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 12,
              hp: 25,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 5,
              hp: 18,
              sector_id: 2,
              bounty: 18,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 35,
              hp: 90,
              sector_id: 3,
              bounty: 50,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [
          [1, 47],
          [3, 50],
        ],
      },
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 9,
              hp: 37,
              sector_id: 1,
              bounty: 13,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 21,
              hp: 67,
              sector_id: 1,
              bounty: 37,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 13,
              hp: 32,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 6,
              hp: 25,
              sector_id: 2,
              bounty: 19,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 36,
              hp: 97,
              sector_id: 3,
              bounty: 52,
            },
            {
              id: 6,
              name: "Transfer Ghost",
              armor: 19,
              hp: 25,
              sector_id: 4,
              bounty: 35,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [
          [1, 50],
          [3, 52],
          [4, 35],
        ],
      },
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 10,
              hp: 44,
              sector_id: 1,
              bounty: 14,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 22,
              hp: 74,
              sector_id: 1,
              bounty: 39,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 14,
              hp: 39,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 7,
              hp: 32,
              sector_id: 2,
              bounty: 20,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 37,
              hp: 104,
              sector_id: 3,
              bounty: 54,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [
          [1, 53],
          [3, 54],
        ],
      },
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 11,
              hp: 51,
              sector_id: 1,
              bounty: 15,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 23,
              hp: 81,
              sector_id: 1,
              bounty: 41,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 15,
              hp: 46,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 8,
              hp: 39,
              sector_id: 2,
              bounty: 21,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 38,
              hp: 111,
              sector_id: 3,
              bounty: 56,
            },
            {
              id: 6,
              name: "Transfer Ghost",
              armor: 19,
              hp: 25,
              sector_id: 4,
              bounty: 35,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [
          [1, 56],
          [2, 30],
          [3, 56],
          [4, 35],
        ],
      },
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 12,
              hp: 58,
              sector_id: 1,
              bounty: 16,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 24,
              hp: 88,
              sector_id: 1,
              bounty: 43,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 16,
              hp: 53,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 9,
              hp: 46,
              sector_id: 2,
              bounty: 22,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 39,
              hp: 118,
              sector_id: 3,
              bounty: 58,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [
          [1, 59],
          [2, 31],
          [3, 58],
        ],
      },
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 13,
              hp: 65,
              sector_id: 1,
              bounty: 17,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 25,
              hp: 95,
              sector_id: 1,
              bounty: 45,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 17,
              hp: 60,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 10,
              hp: 53,
              sector_id: 2,
              bounty: 23,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 40,
              hp: 125,
              sector_id: 3,
              bounty: 60,
            },
            {
              id: 6,
              name: "Transfer Ghost",
              armor: 19,
              hp: 25,
              sector_id: 4,
              bounty: 35,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [
          [1, 62],
          [2, 32],
          [3, 60],
          [4, 35],
        ],
      },
    ],
    hints: [
      "Use the schema and think about which rows must survive each query step.",
      "Check empty groups, boundary values and data changes before hard-coding constants.",
    ],
    workedExample:
      "WITH counts AS (\n    SELECT sector_id, COUNT(*) AS amount\n    FROM enemies\n    GROUP BY sector_id\n)\nSELECT sector_id, amount FROM counts;",
  },
  {
    id: "sql-15",
    title: "Rank within each sector",
    objective:
      "Return name, sector_id, and row number within each sector ordered by bounty descending then id ascending. Order final rows by sector_id then that row number.",
    lesson:
      "ROW_NUMBER restarts within each PARTITION. The window ordering and final output ordering serve different purposes.",
    solution:
      "SELECT name, sector_id, ROW_NUMBER() OVER (PARTITION BY sector_id ORDER BY bounty DESC, id ASC) AS position FROM enemies ORDER BY sector_id, position;",
    ordered: true,
    skills: ["window functions", "partitioning", "ties"],
    difficulty: "Medium",
    cases: [
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 8,
              hp: 30,
              sector_id: 1,
              bounty: 12,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 20,
              hp: 60,
              sector_id: 1,
              bounty: 35,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 12,
              hp: 25,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 5,
              hp: 18,
              sector_id: 2,
              bounty: 18,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 35,
              hp: 90,
              sector_id: 3,
              bounty: 50,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [
          ["Sentinel", 1, 1],
          ["Glitch", 1, 2],
          ["Null Bat", 2, 1],
          ["Wisp", 2, 2],
          ["Iron Maw", 3, 1],
        ],
      },
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 9,
              hp: 37,
              sector_id: 1,
              bounty: 13,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 21,
              hp: 67,
              sector_id: 1,
              bounty: 37,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 13,
              hp: 32,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 6,
              hp: 25,
              sector_id: 2,
              bounty: 19,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 36,
              hp: 97,
              sector_id: 3,
              bounty: 52,
            },
            {
              id: 6,
              name: "Transfer Ghost",
              armor: 19,
              hp: 25,
              sector_id: 4,
              bounty: 35,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [
          ["Sentinel", 1, 1],
          ["Glitch", 1, 2],
          ["Null Bat", 2, 1],
          ["Wisp", 2, 2],
          ["Iron Maw", 3, 1],
          ["Transfer Ghost", 4, 1],
        ],
      },
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 10,
              hp: 44,
              sector_id: 1,
              bounty: 14,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 22,
              hp: 74,
              sector_id: 1,
              bounty: 39,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 14,
              hp: 39,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 7,
              hp: 32,
              sector_id: 2,
              bounty: 20,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 37,
              hp: 104,
              sector_id: 3,
              bounty: 54,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [
          ["Sentinel", 1, 1],
          ["Glitch", 1, 2],
          ["Null Bat", 2, 1],
          ["Wisp", 2, 2],
          ["Iron Maw", 3, 1],
        ],
      },
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 11,
              hp: 51,
              sector_id: 1,
              bounty: 15,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 23,
              hp: 81,
              sector_id: 1,
              bounty: 41,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 15,
              hp: 46,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 8,
              hp: 39,
              sector_id: 2,
              bounty: 21,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 38,
              hp: 111,
              sector_id: 3,
              bounty: 56,
            },
            {
              id: 6,
              name: "Transfer Ghost",
              armor: 19,
              hp: 25,
              sector_id: 4,
              bounty: 35,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [
          ["Sentinel", 1, 1],
          ["Glitch", 1, 2],
          ["Null Bat", 2, 1],
          ["Wisp", 2, 2],
          ["Iron Maw", 3, 1],
          ["Transfer Ghost", 4, 1],
        ],
      },
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 12,
              hp: 58,
              sector_id: 1,
              bounty: 16,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 24,
              hp: 88,
              sector_id: 1,
              bounty: 43,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 16,
              hp: 53,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 9,
              hp: 46,
              sector_id: 2,
              bounty: 22,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 39,
              hp: 118,
              sector_id: 3,
              bounty: 58,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [
          ["Sentinel", 1, 1],
          ["Glitch", 1, 2],
          ["Null Bat", 2, 1],
          ["Wisp", 2, 2],
          ["Iron Maw", 3, 1],
        ],
      },
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 13,
              hp: 65,
              sector_id: 1,
              bounty: 17,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 25,
              hp: 95,
              sector_id: 1,
              bounty: 45,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 17,
              hp: 60,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 10,
              hp: 53,
              sector_id: 2,
              bounty: 23,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 40,
              hp: 125,
              sector_id: 3,
              bounty: 60,
            },
            {
              id: 6,
              name: "Transfer Ghost",
              armor: 19,
              hp: 25,
              sector_id: 4,
              bounty: 35,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [
          ["Sentinel", 1, 1],
          ["Glitch", 1, 2],
          ["Null Bat", 2, 1],
          ["Wisp", 2, 2],
          ["Iron Maw", 3, 1],
          ["Transfer Ghost", 4, 1],
        ],
      },
    ],
    hints: [
      "Use the schema and think about which rows must survive each query step.",
      "Check empty groups, boundary values and data changes before hard-coding constants.",
    ],
    workedExample:
      "SELECT name,\n       ROW_NUMBER() OVER (ORDER BY id) AS position\nFROM enemies;",
  },
  {
    id: "sql-16",
    title: "Restore the Memory Core",
    objective:
      "Return each sector name, enemy count, and total bounty for enemies with armor below 20. Include empty/no-qualifying sectors with zero totals.",
    lesson:
      "Place the armor filter in the LEFT JOIN ON clause, not WHERE, to preserve empty sectors. Group and handle missing sums.",
    solution:
      "SELECT s.name, COUNT(e.id) AS enemy_count, COALESCE(SUM(e.bounty), 0) AS total_bounty FROM sectors s LEFT JOIN enemies e ON e.sector_id = s.id AND e.armor < 20 GROUP BY s.id, s.name;",
    ordered: false,
    skills: ["capstone", "LEFT JOIN filters", "aggregation"],
    difficulty: "Medium",
    cases: [
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 8,
              hp: 30,
              sector_id: 1,
              bounty: 12,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 20,
              hp: 60,
              sector_id: 1,
              bounty: 35,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 12,
              hp: 25,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 5,
              hp: 18,
              sector_id: 2,
              bounty: 18,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 35,
              hp: 90,
              sector_id: 3,
              bounty: 50,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [
          ["Archives", 1, 12],
          ["Wilds", 2, 27],
          ["Citadel", 0, 0],
          ["Dormant", 0, 0],
        ],
      },
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 9,
              hp: 37,
              sector_id: 1,
              bounty: 13,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 21,
              hp: 67,
              sector_id: 1,
              bounty: 37,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 13,
              hp: 32,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 6,
              hp: 25,
              sector_id: 2,
              bounty: 19,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 36,
              hp: 97,
              sector_id: 3,
              bounty: 52,
            },
            {
              id: 6,
              name: "Transfer Ghost",
              armor: 19,
              hp: 25,
              sector_id: 4,
              bounty: 35,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [
          ["Archives", 1, 13],
          ["Wilds", 2, 28],
          ["Citadel", 0, 0],
          ["Dormant", 1, 35],
        ],
      },
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 10,
              hp: 44,
              sector_id: 1,
              bounty: 14,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 22,
              hp: 74,
              sector_id: 1,
              bounty: 39,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 14,
              hp: 39,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 7,
              hp: 32,
              sector_id: 2,
              bounty: 20,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 37,
              hp: 104,
              sector_id: 3,
              bounty: 54,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [
          ["Archives", 1, 14],
          ["Wilds", 2, 29],
          ["Citadel", 0, 0],
          ["Dormant", 0, 0],
        ],
      },
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 11,
              hp: 51,
              sector_id: 1,
              bounty: 15,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 23,
              hp: 81,
              sector_id: 1,
              bounty: 41,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 15,
              hp: 46,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 8,
              hp: 39,
              sector_id: 2,
              bounty: 21,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 38,
              hp: 111,
              sector_id: 3,
              bounty: 56,
            },
            {
              id: 6,
              name: "Transfer Ghost",
              armor: 19,
              hp: 25,
              sector_id: 4,
              bounty: 35,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [
          ["Archives", 1, 15],
          ["Wilds", 2, 30],
          ["Citadel", 0, 0],
          ["Dormant", 1, 35],
        ],
      },
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 12,
              hp: 58,
              sector_id: 1,
              bounty: 16,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 24,
              hp: 88,
              sector_id: 1,
              bounty: 43,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 16,
              hp: 53,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 9,
              hp: 46,
              sector_id: 2,
              bounty: 22,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 39,
              hp: 118,
              sector_id: 3,
              bounty: 58,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [
          ["Archives", 1, 16],
          ["Wilds", 2, 31],
          ["Citadel", 0, 0],
          ["Dormant", 0, 0],
        ],
      },
      {
        fixtures: {
          enemies: [
            {
              id: 1,
              name: "Glitch",
              armor: 13,
              hp: 65,
              sector_id: 1,
              bounty: 17,
            },
            {
              id: 2,
              name: "Sentinel",
              armor: 25,
              hp: 95,
              sector_id: 1,
              bounty: 45,
            },
            {
              id: 3,
              name: "Wisp",
              armor: 17,
              hp: 60,
              sector_id: 2,
              bounty: 9,
            },
            {
              id: 4,
              name: "Null Bat",
              armor: 10,
              hp: 53,
              sector_id: 2,
              bounty: 23,
            },
            {
              id: 5,
              name: "Iron Maw",
              armor: 40,
              hp: 125,
              sector_id: 3,
              bounty: 60,
            },
            {
              id: 6,
              name: "Transfer Ghost",
              armor: 19,
              hp: 25,
              sector_id: 4,
              bounty: 35,
            },
          ],
          sectors: [
            {
              id: 1,
              name: "Archives",
            },
            {
              id: 2,
              name: "Wilds",
            },
            {
              id: 3,
              name: "Citadel",
            },
            {
              id: 4,
              name: "Dormant",
            },
          ],
          drops: [
            {
              enemy_id: 1,
              item: "Shard",
              quantity: 2,
            },
            {
              enemy_id: 2,
              item: "Shield",
              quantity: 1,
            },
            {
              enemy_id: 3,
              item: "Shard",
              quantity: 3,
            },
            {
              enemy_id: 4,
              item: "Shard",
              quantity: 1,
            },
          ],
        },
        expected: [
          ["Archives", 1, 17],
          ["Wilds", 2, 32],
          ["Citadel", 0, 0],
          ["Dormant", 1, 35],
        ],
      },
    ],
    hints: [
      "Use the schema and think about which rows must survive each query step.",
      "Check empty groups, boundary values and data changes before hard-coding constants.",
    ],
    workedExample:
      "SELECT s.id, e.name\nFROM sectors AS s\nLEFT JOIN enemies AS e\n    ON e.sector_id = s.id AND e.hp > 30;",
  },
];
