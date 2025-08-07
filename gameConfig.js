// Game Configuration - Centralized stats, costs and messages
// Balanced for better gameplay experience
const CHARACTER_STATS = {
  Fighter: { hp: 14, dmg: 4, mana: 45 },   // +2 HP, +5 mana (more tankier)
  Paladin: { hp: 16, dmg: 3, mana: 160 },  // Unchanged (already well balanced)
  Monk: { hp: 10, dmg: 2, mana: 200 },     // +2 HP (survivability)
  Berzerker: { hp: 10, dmg: 4, mana: 0 },  // +2 HP (needs more survivability)
  Assassin: { hp: 8, dmg: 6, mana: 30 },   // +2 HP, +10 mana (glass cannon but not too fragile)
  Wizard: { hp: 10, dmg: 2, mana: 200 },   // Balanced (high mana, low HP)
  Healer: { hp: 14, dmg: 1, mana: 180 }    // Support role (high HP, low DMG)
};

const ABILITY_COSTS = {
  darkVision: 20,
  healingLightning: 40,
  heal: 25,
  shadowHit: 20,
  rage: 0,
  fireball: 25,
  massHeal: 40
};

const MESSAGES = {
  MANA: {
    notEnough: (name, ability) => `${name} doesn't have enough mana for ${ability}!`
  },
  ATTACKS: {
    using: (name, ability, target) => `${name} uses ${ability} on ${target}!`,
    usingNoTarget: (name, ability) => `${name} uses ${ability}!`,
    attacking: (attacker, target, damage) => `${attacker} is attacking ${target}. He deals him ${damage} damages.`,
    hpLeft: (target, hp) => `${target} got ${hp} lifepoints left.`,
    fireball: (name, target) => `${name} casts Fireball on ${target}!`,
    massHeal: (name) => `${name} casts Mass Heal on the party!`
  },
  COMBAT: {
    defeat: (name) => `${name} is defeated!`,
    manaGain: (name, target) => `${name} gains 20 mana for defeating ${target}!`
  },
  HEALING: {
    heals: (name, amount, hp, maxHp) => `${name} heals for ${amount} HP! (${hp}/${maxHp})`
  },
  EFFECTS: {
    // Fighter
    damageReduction: (name) => `${name} will take 2 less damage on the next hit!`,
    damageReduced: (name, original, reduced) => `${name} reduces ${original} damage to ${reduced}!`,
    
    // Berzerker  
    rageAttack: (name, dmg) => `${name} gains +1 permanent attack! (now ${dmg} DMG)`,
    rageDamage: (name, hp) => `${name} loses 1 HP from rage! (${hp} HP left)`,
    rageDeath: (name) => `${name} dies from his own rage!`,
    
    // Assassin
    immunity: (name) => `${name} becomes immune to damage on next turn!`,
    immuneToDamage: (name) => `${name} is immune and takes no damage!`,
    counterDamage: (name, target) => `${name} will take 7 damage later if ${target} survives!`,
    shadowCounter: (name) => `${name} takes 7 counter-damage from Shadow Hit!`
  }
};

module.exports = { CHARACTER_STATS, ABILITY_COSTS, MESSAGES };