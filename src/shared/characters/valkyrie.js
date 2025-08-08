import { Character } from './character.js';
import { ABILITY_COSTS, MESSAGES } from '../gameConfig.js';

export class Valkyrie extends Character {
  constructor(name) {
    super(name);
  }

  missileSwarm(target) {
    const { name } = this;
    const manaCost = ABILITY_COSTS.missileSwarm;

    if (!this.consumeMana(manaCost, "Missile Swarm")) {
      return false;
    }

    console.log(MESSAGES.ATTACKS.missileSwarm(name, target.name));

    this.attack(target, 8);

    return true;
  }
}

export default Valkyrie;