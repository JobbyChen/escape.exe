// Skill activation is deterministic and requires a correct cast, never a failed answer.
export function activateSkills(party, enemyHp, selectedIds = []) {
  const effects = {
    spellBonus: 0,
    hotfix: 0,
    utilityBonus: 0,
    targetedShields: [],
    events: [],
    revived: 0,
  };
  // A revived ally can fight now, but does not trigger another skill in the same cast.
  const casters = party.filter((unit) => unit.hp > 0 && selectedIds.includes(unit.id));
  for (const unit of casters) {
    unit.correctTurns = (unit.correctTurns || 0) + 1;
    const skill = unit.skill;
    if (!skill) continue;
    let detail = "";
    switch (skill.id) {
      case "firewall":
        effects.targetedShields.push({ id: unit.id, points: 12, bonus: false });
        detail = "12 base utility reserved for own shield";
        break;
      case "hotfix":
        effects.hotfix += 8;
        detail = "up to 8 bonus healing";
        break;
      case "index-mark":
        effects.spellBonus += 4;
        detail = "precision mark deals 4 damage";
        break;
      case "echo-shot":
        {
          effects.spellBonus += 4;
          detail = "4 follow-up spell damage";
        }
        break;
      case "trail-guard":
        unit.guardReady = true;
        detail = "next single hit reduced by 6";
        break;
      case "static-wall":
        effects.targetedShields.push({ id: unit.id, points: 8, bonus: true });
        detail = "8 bonus self-shield";
        break;
      case "packet-courier": {
        const target = party
          .filter((ally) => ally.hp > 0)
          .sort((a, b) => (a.shield || 0) - (b.shield || 0))[0];
        effects.targetedShields.push({
          id: target.id,
          points: 8,
          bonus: false,
        });
        detail = `8 base utility routed to ${target.name}`;
        break;
      }
      case "null-ward":
        unit.guardReady = true;
        detail = "next AoE reduced by 4 for everyone";
        break;
      case "nova-burst":
        {
          effects.spellBonus += 6;
          detail = "6 burst spell damage";
        }
        break;
      case "load-balancer":
        unit.guardReady = true;
        detail = "next AoE reduced by 8 for other allies";
        break;
      case "kill-switch":
        if (enemyHp <= 80) {
          effects.spellBonus += 10;
          detail = "10 execute spell damage";
        }
        break;
      case "dawn-protocol": {
        effects.utilityBonus += 16;
        detail = "up to 16 bonus healing/shielding (team cap applies)";
        const fallen = party.find((ally) => ally.hp <= 0);
        if (fallen && !unit.revivalUsed) {
          fallen.hp = Math.ceil(fallen.maxHp * 0.35);
          unit.revivalUsed = true;
          effects.revived += fallen.hp;
          detail += `; revived ${fallen.name} at ${fallen.hp} HP`;
        }
        break;
      }
    }
    if (detail) effects.events.push(`${unit.name} / ${skill.name}: ${detail}`);
  }
  return effects;
}
