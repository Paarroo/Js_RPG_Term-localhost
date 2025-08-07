// Monk class - Web Browser Version  
class Monk extends Character {
  constructor(name) {
    super(name);
  }

  // Heal special ability (self-heal)
  heal() {
    const { name } = this;
    const manaCost = ABILITY_COSTS.heal;

    // Check and consume mana
    if (!this.consumeMana(manaCost, "Heal")) {
      return false;
    }

    console.log(MESSAGES.ATTACKS.usingNoTarget(name, "Heal"));

    // Use inherited heal method for 8 HP
    super.heal(8);

    return true;
  }
}