const { CHARACTER_STATS, MESSAGES } = require('../gameConfig');

class Character {
  constructor(name, hp = null, dmg = null, mana = null, maxHp = null) {
    const className = this.constructor.name;
    const stats = CHARACTER_STATS[className];

    this.name = name;
    this.hp = hp !== null ? hp : (stats ? stats.hp : 10); // Fallback to 10 if no stats
    this.dmg = dmg !== null ? dmg : (stats ? stats.dmg : 1);
    this.mana = mana !== null ? mana : (stats ? stats.mana : 0);
    this.maxHp = maxHp || this.hp; // Intelligent maxHp: use provided or default to hp

    this.status = "playing"; // By default
    this.isPlayerControlled = false; // By default, controlled by AI
  }

  // takeDamage method (damage as parameter)
  takeDamage(damage) {
    const { name } = this;

    this.hp -= damage;

    // If HP = 0 = loser
    if (this.hp <= 0) {
      this.hp = 0;
      this.status = "loser";
      console.log(MESSAGES.COMBAT.defeat(name));
    }
  }

  // Generic attack method (target and damage as parameters)
  attack(target, damage) {
    const { name } = this;

    console.log(MESSAGES.ATTACKS.attacking(name, target.name, damage));

    target.takeDamage(damage);

    console.log(MESSAGES.ATTACKS.hpLeft(target.name, target.hp));

    // If target dies, attacker gains 20 mana
    if (target.status === "loser") {
      this.mana += 20;
      console.log(MESSAGES.COMBAT.manaGain(name, target.name));
    }
  }

  // dealDamage method (target as parameter) - uses generic attack
  dealDamage(target) {
    this.attack(target, this.dmg);
  }

  // Generic method to consume mana for special attacks
  consumeMana(manaCost, attackName) {
    if (this.mana < manaCost) {
      console.log(MESSAGES.MANA.notEnough(this.name, attackName));
      return false;
    }

    this.mana -= manaCost;
    return true;
  }

  // Centralized heal method with maxHp cap
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

  // Check if character is eliminated
  isDead() {
    return this.status === "loser";
  }

  // Centralized displayStats with dynamic class name
  displayStats() {
    const { name, hp, dmg, mana, status, maxHp } = this;
    const className = this.constructor.name;
    const hpDisplay = maxHp ? `${hp}/${maxHp}` : `${hp}`;

    console.log(`${name} (${className}): ${hpDisplay} HP, ${dmg} DMG, ${mana} mana [${status}]`);

    // Hook for special effects display
    if (typeof this.displaySpecialEffects === 'function') {
      this.displaySpecialEffects();
    }
  }
}

module.exports = Character;
