// Encounter-local charge. Eight bits make one Byte; only lesson auto-attacks earn bits.
export const BITS_PER_ATTACK = 8;
export const SKILL_BIT_COSTS = {
  byte: 12,
  patch: 13,
  echo: 14,
  pip: 15,
  query: 16,
  fern: 17,
  bolt: 18,
  rune: 19,
  nova: 20,
  atlas: 21,
  zero: 22,
  sol: 24,
};
export function skillBitCost(unit, stars = unit.stars || 0) {
  return Math.max(8, (SKILL_BIT_COSTS[unit.id] || 16) - stars);
}
export function skillReady(unit) {
  return unit.hp > 0 && unit.bits >= skillBitCost(unit);
}
export function chargeFromAttack(party) {
  for (const unit of party) {
    if (unit.hp > 0)
      unit.bits = Math.min(
        skillBitCost(unit),
        (unit.bits || 0) + BITS_PER_ATTACK,
      );
  }
}
