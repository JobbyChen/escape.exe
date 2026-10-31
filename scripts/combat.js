import { activateSkills } from "./character-skills.js";
import { chargeFromAttack, skillBitCost, skillReady } from "./skill-charge.js";
// Deterministic combat and ascension stats, independent of the DOM.
export const ASCENSION_COSTS = [1, 3, 5];
export const spentDuplicates = (stars) =>
  ASCENSION_COSTS.slice(0, stars).reduce((sum, cost) => sum + cost, 0);
export function characterStats(character, stars = 0) {
  const base =
    character.baseStats ||
    (character.role === "Tank"
      ? { hp: 180, attack: 16, defense: 12 }
      : character.role === "Healer" || character.role === "Support"
        ? { hp: 100, attack: 14, defense: 5 }
        : { hp: 110, attack: 24, defense: 4 });
  const multiplier = 1 + stars * 0.2;
  return Object.fromEntries(
    Object.entries(base).map(([key, value]) => [
      key,
      Math.round(value * multiplier),
    ]),
  );
}
export function createBattleParty(state, characters) {
  return state.party.map((id) => {
    const character = characters.find((unit) => unit.id === id);
    const stats = characterStats(character, state.ascensions[id] || 0);
    return {
      ...character,
      ...stats,
      maxHp: stats.hp,
      stars: state.ascensions[id] || 0,
      bits: 0,
      shield: 0,
      correctTurns: 0,
      guardReady: false,
      markReady: false,
      revivalUsed: false,
    };
  });
}
export function retaliate(party, enemy) {
  const alive = party.filter((unit) => unit.hp > 0);
  const targets =
    enemy.type === "aoe"
      ? alive
      : [alive.find((unit) => unit.role === "Tank") || alive[0]].filter(
          Boolean,
        );
  const guards = alive.filter(
    (unit) =>
      unit.guardReady &&
      (enemy.type === "aoe"
        ? ["null-ward", "load-balancer"].includes(unit.skill?.id)
        : unit.skill?.id === "trail-guard"),
  );
  const hits = targets.map((unit) => {
    const mitigation = guards.reduce(
      (sum, guard) =>
        sum +
        (guard.skill.id === "trail-guard"
          ? 6
          : guard.skill.id === "null-ward"
            ? 4
            : guard.id !== unit.id
              ? 8
              : 0),
      0,
    );
    const incoming = Math.max(1, enemy.attack - unit.defense - mitigation);
    const absorbed = Math.min(unit.shield || 0, incoming);
    unit.shield = (unit.shield || 0) - absorbed;
    const damage = Math.min(unit.hp, incoming - absorbed);
    unit.hp -= damage;
    return { id: unit.id, name: unit.name, damage, absorbed, mitigation };
  });
  guards.forEach((guard) => (guard.guardReady = false));
  return { hits, defeated: party.every((unit) => unit.hp <= 0) };
}

export function resolveLessonTurn(
  party,
  enemyHp,
  remainingExercises,
  skillUnitId = null,
) {
  const caster = skillUnitId
    ? party.find((unit) => unit.id === skillUnitId)
    : null;
  if (skillUnitId && (!caster || !skillReady(caster))) return null;
  if (caster) caster.bits -= skillBitCost(caster);
  if (!party.some((unit) => unit.hp > 0))
    return {
      auto: 0,
      spell: 0,
      utility: 0,
      hp: enemyHp,
      healed: 0,
      shielded: 0,
      skills: [],
      revived: 0,
    };
  const effects = activateSkills(party, enemyHp, caster ? [caster.id] : []);
  const alive = party.filter((unit) => unit.hp > 0);
  const auto = caster
    ? 0
    : Math.max(
        20,
        Math.min(
          25,
          Math.round(
            (20 * alive.reduce((sum, unit) => sum + unit.attack, 0)) / 78,
          ),
        ),
      );
  const spell = (caster ? 0 : 40) + Math.min(10, effects.spellBonus);
  const baseUtility = caster
    ? caster.skill.id === "firewall"
      ? 12
      : caster.skill.id === "packet-courier"
        ? 8
        : 0
    : 40;
  let utility = baseUtility,
    healed = 0,
    shielded = 0,
    bonusBudget = 24;
  const byInjury = () =>
    [...alive].sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp);
  // Patch's bonus is healing only; it cannot become a barrier on a healthy party.
  for (const unit of byInjury()) {
    const heal = Math.min(effects.hotfix, bonusBudget, unit.maxHp - unit.hp);
    unit.hp += heal;
    effects.hotfix -= heal;
    bonusBudget -= heal;
    healed += heal;
  }
  for (const shield of effects.targetedShields) {
    const unit = alive.find((ally) => ally.id === shield.id);
    const points = Math.min(
      shield.points,
      shield.bonus ? bonusBudget : utility,
    );
    if (shield.bonus) bonusBudget -= points;
    else utility -= points;
    unit.shield = (unit.shield || 0) + points;
    shielded += points;
  }
  const extra = Math.min(bonusBudget, effects.utilityBonus);
  bonusBudget -= extra;
  utility += extra;
  for (const unit of byInjury()) {
    const heal = Math.min(utility, unit.maxHp - unit.hp);
    unit.hp += heal;
    utility -= heal;
    healed += heal;
  }
  alive.forEach((unit, index) => {
    const share = Math.floor(utility / (alive.length - index));
    unit.shield = (unit.shield || 0) + share;
    utility -= share;
    shielded += share;
  });
  // A strongest possible turn is 25 + 50 = 75: 180/240 HP still needs 3/4 examples.
  if (!caster) chargeFromAttack(party);
  return {
    auto,
    spell,
    utility: baseUtility + 24 - bonusBudget,
    healed,
    shielded,
    hp: Math.max(caster ? 1 : 0, enemyHp - auto - spell),
    skills: effects.events,
    revived: effects.revived,
  };
}
