// Paladin class - Web Browser Version
class Paladin extends Character {
  constructor(name) {
    super(name);
  }

  // Healing Lightning special attack
  healingLightning(target) {
    const { name } = this;
    const manaCost = ABILITY_COSTS.healingLightning;

    // Check and consume mana
    if (!this.consumeMana(manaCost, "Healing Lightning")) {
      return false;
    }

    console.log(MESSAGES.ATTACKS.using(name, "Healing Lightning", target.name));

    // Effect 1: "inflicting 4 damage"
    this.attack(target, 4);

    // Effect 2: "healing himself for 5 HP"
    this.heal(5);

    return true;
  }
}