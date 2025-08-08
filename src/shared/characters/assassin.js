import { Character } from './character.js';
import { ABILITY_COSTS, MESSAGES } from '../gameConfig.js';

export class Assassin extends Character {
  constructor(name) {
    super(name);

    this.immuneNextTurn = false;
    this.shadowHitActive = false;
  }

  shadowHit(target) {
    const { name } = this;
    const manaCost = ABILITY_COSTS.shadowHit;

    if (!this.consumeMana(manaCost, "Shadow Hit")) {
      return false;
    }

    console.log(MESSAGES.ATTACKS.using(name, "Shadow Hit", target.name));

    this.immuneNextTurn = true;
    console.log(MESSAGES.EFFECTS.immunity(name));

    this.attack(target, 7);

    if (!target.isDead()) {
      this.shadowHitActive = true;
      console.log(MESSAGES.EFFECTS.counterDamage(name, target.name));
    }

    return true;
  }

  takeDamage(damage) {
    const { name } = this;

    if (this.immuneNextTurn) {
      console.log(MESSAGES.EFFECTS.immuneToDamage(name));
      this.immuneNextTurn = false;
      return;
    }

    super.takeDamage(damage);
  }

  applyShadowHitCounterDamage() {
    const { name } = this;

    if (this.shadowHitActive) {
      console.log(MESSAGES.EFFECTS.shadowCounter(name));
      this.shadowHitActive = false;
      super.takeDamage(7);
    }
  }

  displaySpecialEffects() {
    const { immuneNextTurn, shadowHitActive } = this;
    if (immuneNextTurn) {
      console.log(`  → Immune to damage on next turn`);
    }
    if (shadowHitActive) {
      console.log(`  → Will take 7 counter-damage`);
    }
  }
}

export default Assassin;