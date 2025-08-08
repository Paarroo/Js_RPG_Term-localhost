import { Character } from './character.js';
import { ABILITY_COSTS, MESSAGES } from '../gameConfig.js';

export class Monk extends Character {
  constructor(name) {
    super(name);
  }

  heal() {
    const { name } = this;
    const manaCost = ABILITY_COSTS.heal;

    if (!this.consumeMana(manaCost, "Heal")) {
      return false;
    }

    console.log(MESSAGES.ATTACKS.usingNoTarget(name, "Heal"));

    super.heal(8);

    return true;
  }
}

export default Monk;