class Valkyrie extends Character {
  constructor(name) {
    super(name);
  }

  // Missile Swarm special attack - high damage ranged attack
  missileSwarm(target) {
    const { name } = this;
    const manaCost = ABILITY_COSTS.missileSwarm;

    // Check and consume mana
    if (!this.consumeMana(manaCost, "Missile Swarm")) {
      return false;
    }

    console.log(MESSAGES.ATTACKS.missileSwarm(name, target.name));

    // High damage attack (8 points) to compensate for single ability
    this.attack(target, 8);

    return true;
  }
}
