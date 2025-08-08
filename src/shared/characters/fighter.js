import { Character } from './character.js';
import { ABILITY_COSTS, MESSAGES } from '../gameConfig.js';

export class Fighter extends Character {
  constructor(name) {
    super(name);

    this.damageReduction = 0;
  }

  darkVision(target) {
    const { name } = this;
    const manaCost = ABILITY_COSTS.darkVision;

    if (!this.consumeMana(manaCost, "Dark Vision")) {
      return false;
    }

    console.log(MESSAGES.ATTACKS.using(name, "Dark Vision", target.name));

    this.attack(target, 5);

    this.damageReduction = 2;
    console.log(MESSAGES.EFFECTS.damageReduction(name));

    return true;
  }

  takeDamage(damage) {
    const { name, damageReduction } = this;

    if (damageReduction > 0) {
      const reducedDamage = Math.max(0, damage - damageReduction);
      console.log(MESSAGES.EFFECTS.damageReduced(name, damage, reducedDamage));
      this.damageReduction = 0;

      super.takeDamage(reducedDamage);
    } else {
      super.takeDamage(damage);
    }
  }

  displaySpecialEffects() {
    const { damageReduction } = this;
    if (damageReduction > 0) {
      console.log(`  → Damage reduction: ${damageReduction} on next hit`);
    }
  }
}

export default Fighter;