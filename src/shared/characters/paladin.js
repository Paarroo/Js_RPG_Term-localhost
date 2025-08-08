import { Character } from './character.js';
import { ABILITY_COSTS, MESSAGES } from '../gameConfig.js';

export class Paladin extends Character {
  constructor(name) {
    super(name);
  }

  healingLightning(target) {
    const { name } = this;
    const manaCost = ABILITY_COSTS.healingLightning;

    if (!this.consumeMana(manaCost, "Healing Lightning")) {
      return false;
    }

    console.log(MESSAGES.ATTACKS.using(name, "Healing Lightning", target.name));

    this.attack(target, 4);

    this.heal(5);

    return true;
  }
}

export default Paladin;