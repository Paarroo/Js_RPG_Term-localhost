import { Character } from './character.js';
import { ABILITY_COSTS, MESSAGES } from '../gameConfig.js';

export class Wizard extends Character {
  constructor(name) {
    super(name);
  }

  fireball(target) {
    const { name } = this;
    const manaCost = ABILITY_COSTS.fireball;

    if (!this.consumeMana(manaCost, "Fireball")) {
      return false;
    }

    console.log(MESSAGES.ATTACKS.fireball(name, target.name));

    this.attack(target, 7);

    return true;
  }
}

export default Wizard;