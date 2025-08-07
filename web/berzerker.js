class Berzerker extends Character {
  constructor(name) {
    super(name);
  }

  // Rage special attack
  rage() {
    const { name } = this;

    // No mana cost (costs 0 mana)
    console.log(MESSAGES.ATTACKS.usingNoTarget(name, "Rage"));

    // Effect 1: "+1 attack for the rest of the game"
    this.dmg += 1;
    console.log(MESSAGES.EFFECTS.rageAttack(name, this.dmg));

    // Effect 2: "-1 HP"
    this.hp -= 1;
    console.log(MESSAGES.EFFECTS.rageDamage(name, this.hp));

    // Check if Berzerker dies from his own rage
    if (this.hp <= 0) {
      this.hp = 0;
      this.status = "loser";
      console.log(MESSAGES.EFFECTS.rageDeath(name));
      return false; // Rage failed because character died
    }

    return true;
  }
}
