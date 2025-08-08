import { CHARACTER_STATS, MESSAGES } from '../gameConfig.js';

export class Character {
  constructor(name, hp = null, dmg = null, mana = null, maxHp = null) {
    const className = this.constructor.name;
    const stats = CHARACTER_STATS[className];

    this.name = name;
    this.hp = hp !== null ? hp : (stats ? stats.hp : 10);
    this.dmg = dmg !== null ? dmg : (stats ? stats.dmg : 1);
    this.mana = mana !== null ? mana : (stats ? stats.mana : 0);
    this.maxHp = maxHp || this.hp;

    this.status = "playing";
    this.isPlayerControlled = false;
  }

  takeDamage(damage) {
    const { name } = this;

    this.hp -= damage;

    if (this.hp <= 0) {
      this.hp = 0;
      this.status = "loser";
      console.log(MESSAGES.COMBAT.defeat(name));
    }
  }

  attack(target, damage) {
    const { name } = this;

    console.log(MESSAGES.ATTACKS.attacking(name, target.name, damage));

    target.takeDamage(damage);

    console.log(MESSAGES.ATTACKS.hpLeft(target.name, target.hp));

    if (target.status === "loser") {
      this.mana += 20;
      console.log(MESSAGES.COMBAT.manaGain(name, target.name));
    }
  }

  dealDamage(target) {
    this.attack(target, this.dmg);
  }

  consumeMana(manaCost, attackName) {
    if (this.mana < manaCost) {
      console.log(MESSAGES.MANA.notEnough(this.name, attackName));
      return false;
    }

    this.mana -= manaCost;
    return true;
  }

  heal(amount) {
    const { name, maxHp } = this;
    const oldHp = this.hp;
    this.hp = Math.min(maxHp, this.hp + amount);
    const actualHeal = this.hp - oldHp;

    if (actualHeal > 0) {
      console.log(MESSAGES.HEALING.heals(name, actualHeal, this.hp, maxHp));
    }

    return actualHeal;
  }

  isDead() {
    return this.status === "loser";
  }

  displayStats() {
    const { name, hp, dmg, mana, status, maxHp } = this;
    const className = this.constructor.name;
    const hpDisplay = maxHp ? `${hp}/${maxHp}` : `${hp}`;

    console.log(`${name} (${className}): ${hpDisplay} HP, ${dmg} DMG, ${mana} mana [${status}]`);

    if (typeof this.displaySpecialEffects === 'function') {
      this.displaySpecialEffects();
    }
  }
}

export default Character;
