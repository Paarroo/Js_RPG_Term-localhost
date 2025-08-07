// Assassin class - Web Browser Version
class Assassin extends Character {
  constructor(name) {
    super(name);

    // Assassin-specific properties
    this.isImmune = false;
    this.shadowHitCounterTargets = []; // Array to track counter-damage targets
  }

  // Shadow Hit special attack
  shadowHit(target) {
    const { name } = this;
    const manaCost = ABILITY_COSTS.shadowHit;

    // Check and consume mana
    if (!this.consumeMana(manaCost, "Shadow Hit")) {
      return false;
    }

    console.log(MESSAGES.ATTACKS.using(name, "Shadow Hit", target.name));

    // Effect 1: "inflicting 7 damage"
    this.attack(target, 7);

    // Effect 2: "becoming immune to damage on next turn"
    this.isImmune = true;
    console.log(MESSAGES.EFFECTS.immunity(name));

    // Effect 3: "if the target survives, will take 7 damage later"
    if (!target.isDead()) {
      this.shadowHitCounterTargets.push(target);
      console.log(MESSAGES.EFFECTS.counterDamage(name, target.name));
    }

    return true;
  }

  // Override takeDamage to handle immunity
  takeDamage(damage) {
    const { name } = this;

    if (this.isImmune) {
      console.log(MESSAGES.EFFECTS.immuneToDamage(name));
      this.isImmune = false; // Immunity only works once
      return; // Take no damage
    }

    // Normal damage
    super.takeDamage(damage);
  }

  // Apply counter-damage from Shadow Hit after each turn
  applyShadowHitCounterDamage() {
    const { name } = this;

    this.shadowHitCounterTargets.forEach(target => {
      if (!target.isDead()) {
        console.log(MESSAGES.EFFECTS.shadowCounter(target.name));
        // Use super.takeDamage to bypass immunity
        super.takeDamage(7);
      }
    });

    // Clear counter targets after applying damage
    this.shadowHitCounterTargets = [];
  }

  // Display special effects for Assassin
  displaySpecialEffects() {
    const { isImmune, shadowHitCounterTargets } = this;
    if (isImmune) {
      console.log(`  → Immune to damage on next hit`);
    }
    if (shadowHitCounterTargets.length > 0) {
      console.log(`  → Will take counter-damage: ${shadowHitCounterTargets.length} target(s)`);
    }
  }
}