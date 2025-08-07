class Wizard extends Character {
  constructor(name) {
    super(name);
  }

  // Fireball special attack
  fireball(target) {
    const { name } = this;
    const manaCost = ABILITY_COSTS.fireball || 25;

    // Check and consume mana
    if (!this.consumeMana(manaCost, "Fireball")) {
      return false;
    }

    console.log(MESSAGES.ATTACKS.using(name, "Fireball", target.name));

    // High damage magical attack (7 points)
    this.attack(target, 7);

    return true;
  }
}
