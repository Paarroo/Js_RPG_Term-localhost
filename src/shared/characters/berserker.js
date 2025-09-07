import { Character } from './character.js';
import { MESSAGES } from '../gameConfig.js';

export class Berserker extends Character {
  constructor(name) {
    super(name);
  }

  rage() {
    const { name } = this;

    console.log(MESSAGES.ATTACKS.usingNoTarget(name, "Rage"));

    this.dmg += 1;
    console.log(MESSAGES.EFFECTS.rageAttack(name, this.dmg));

    this.hp -= 1;
    console.log(MESSAGES.EFFECTS.rageDamage(name, this.hp));

    if (this.hp <= 0) {
      this.hp = 0;
      this.status = "loser";
      console.log(MESSAGES.EFFECTS.rageDeath(name));
    }

    return true;
  }
}

export default Berserker;