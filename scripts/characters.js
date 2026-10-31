// Original roster: individual stats and implemented skills, independent of lesson content.
export const characters = [
  {
    id: "byte",
    name: "Byte Knight",
    role: "Tank",
    rarity: "Common",
    color: "#a6c8f5",
    baseStats: { hp: 180, attack: 16, defense: 12 },
    skill: {
      id: "firewall",
      name: "Firewall",
      description:
        "After charging and solving Firewall's prompt, grant Byte 12 shield points.",
    },
  },
  {
    id: "patch",
    name: "Patch",
    role: "Healer",
    rarity: "Common",
    color: "#bcf484",
    baseStats: { hp: 100, attack: 14, defense: 5 },
    skill: {
      id: "hotfix",
      name: "Hotfix",
      description:
        "Activate Hotfix to restore up to 8 HP to injured living allies. Unused healing does not become a shield.",
    },
  },
  {
    id: "query",
    name: "Query Mage",
    role: "Caster",
    rarity: "Rare",
    color: "#f6cf77",
    baseStats: { hp: 120, attack: 26, defense: 6 },
    skill: {
      id: "index-mark",
      name: "Index Mark",
      description:
        "Activate Index Mark to pinpoint a weakness and deal 4 damage.",
    },
  },
  {
    id: "echo",
    name: "Echo",
    role: "Ranged",
    rarity: "Common",
    color: "#f49a8f",
    baseStats: { hp: 108, attack: 22, defense: 4 },
    skill: {
      id: "echo-shot",
      name: "Echo Shot",
      description:
        "Activate Echo Shot to deal 4 follow-up damage.",
    },
  },
  {
    id: "fern",
    name: "Fern Scout",
    role: "Ranged",
    rarity: "Common",
    color: "#80cba0",
    baseStats: { hp: 102, attack: 22, defense: 6 },
    skill: {
      id: "trail-guard",
      name: "Trail Guard",
      description:
        "Activate Trail Guard to reduce the next single-target enemy attack by 6. Guards do not stack.",
    },
  },
  {
    id: "bolt",
    name: "Bolt",
    role: "Tank",
    rarity: "Rare",
    color: "#c8b4e9",
    baseStats: { hp: 205, attack: 18, defense: 14 },
    skill: {
      id: "static-wall",
      name: "Static Wall",
      description:
        "Activate Static Wall to grant Bolt 8 shield points.",
    },
  },
  {
    id: "pip",
    name: "Pip",
    role: "Support",
    rarity: "Common",
    color: "#f1b58f",
    baseStats: { hp: 105, attack: 13, defense: 7 },
    skill: {
      id: "packet-courier",
      name: "Packet Courier",
      description:
        "Activate Packet Courier to grant 8 shield points to the living ally with the least shielding.",
    },
  },
  {
    id: "rune",
    name: "Rune",
    role: "Caster",
    rarity: "Rare",
    color: "#78cbd1",
    baseStats: { hp: 125, attack: 22, defense: 7 },
    skill: {
      id: "null-ward",
      name: "Null Ward",
      description:
        "Activate Null Ward to reduce the next AoE attack by 4 for every living ally. Guards do not stack.",
    },
  },
  {
    id: "nova",
    name: "Nova",
    role: "Caster",
    rarity: "Epic",
    color: "#e9a6d2",
    baseStats: { hp: 138, attack: 30, defense: 8 },
    skill: {
      id: "nova-burst",
      name: "Nova Burst",
      description:
        "Activate Nova Burst to deal 6 damage in a concentrated burst.",
    },
  },
  {
    id: "atlas",
    name: "Atlas",
    role: "Tank",
    rarity: "Epic",
    color: "#b5bdcf",
    baseStats: { hp: 245, attack: 20, defense: 18 },
    skill: {
      id: "load-balancer",
      name: "Load Balancer",
      description:
        "Activate Load Balancer to reduce the next AoE attack by 8 for every other living ally.",
    },
  },
  {
    id: "zero",
    name: "Zero",
    role: "Assassin",
    rarity: "Legendary",
    color: "#ffffff",
    baseStats: { hp: 165, attack: 38, defense: 10 },
    skill: {
      id: "kill-switch",
      name: "Kill Switch",
      description:
        "Activate Kill Switch when the enemy has 80 HP or less to deal 10 damage. Skills cannot deliver the final blow before lesson completion.",
    },
  },
  {
    id: "sol",
    name: "Sol",
    role: "Support",
    rarity: "Legendary",
    color: "#ffe58c",
    baseStats: { hp: 190, attack: 26, defense: 15 },
    skill: {
      id: "dawn-protocol",
      name: "Dawn Protocol",
      description:
        "Activate Dawn Protocol to grant 16 healing/shielding points. The first activation with a fallen ally also revives one ally at 35% max HP, once per stage attempt. Sol must be alive.",
    },
  },
];
