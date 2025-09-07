export class UIManager {
  static displayHealthBar(character) {
    const { hp, maxHp } = character;
    const barLength = 10;
    const fillLength = Math.round((hp / maxHp) * barLength);
    const emptyLength = barLength - fillLength;
    
    const filledBar = '█'.repeat(fillLength);
    const emptyBar = '░'.repeat(emptyLength);
    
    return `${filledBar}${emptyBar} (${hp}/${maxHp})`;
  }
  
  static displayManaBar(character) {
    const { mana } = character;
    const maxMana = character.maxMana || 200; // Fallback for classes without maxMana
    
    // Handle Berserker (0 max mana)
    if (maxMana === 0) {
      return '░'.repeat(10) + ' (0/0)';
    }
    
    const barLength = 10;
    const fillLength = Math.max(0, Math.min(barLength, Math.round((mana / maxMana) * barLength)));
    const emptyLength = Math.max(0, barLength - fillLength);
    
    const filledBar = '█'.repeat(fillLength);
    const emptyBar = '░'.repeat(emptyLength);
    
    return `${filledBar}${emptyBar} (${mana}/${maxMana})`;
  }
  
  static getClassIcon(className) {
    const icons = {
      Fighter: '⚔️',
      Paladin: '🛡️',
      Monk: '☯️',
      Berserker: '🪓',
      Assassin: '🗡️',
      Wizard: '🔮',
      Valkyrie: '🚁'
    };
    
    return icons[className] || '❓';
  }
  
  static displayEnhancedStats(character) {
    const className = character.constructor.name;
    const icon = this.getClassIcon(className);
    const { name, hp, dmg, mana, status } = character;
    
    console.log(`\n${icon} ${name} (${className}) [${status.toUpperCase()}]`);
    console.log(`   HP:   ${this.displayHealthBar(character)}`);
    console.log(`   Mana: ${this.displayManaBar(character)}`);
    console.log(`   DMG:  ${dmg} points`);
    
    if (typeof character.displaySpecialEffects === 'function') {
      character.displaySpecialEffects();
    }
  }
  
  static displayAllEnhanced(characters) {
    console.log("\n" + "=".repeat(50));
    console.log("           🏟️  BATTLE ARENA STATUS 🏟️");
    console.log("=".repeat(50));
    
    const alive = characters.filter(char => !char.isDead());
    const dead = characters.filter(char => char.isDead());
    
    if (alive.length > 0) {
      console.log("\n⚡ ACTIVE FIGHTERS:");
      alive.forEach(character => {
        this.displayEnhancedStats(character);
      });
    }
    
    if (dead.length > 0) {
      console.log("\n💀 DEFEATED:");
      dead.forEach(character => {
        const className = character.constructor.name;
        const icon = this.getClassIcon(className);
        console.log(`   ${icon} ${character.name} (${className}) - ELIMINATED`);
      });
    }
    
    console.log("\n" + "=".repeat(50));
  }
  
  static displayTurnHeader(turnNumber, currentPlayer) {
    const className = currentPlayer.constructor.name;
    const icon = this.getClassIcon(className);
    
    console.log("\n" + "~".repeat(40));
    console.log(`    🏆 TURN ${turnNumber} - ${icon} ${currentPlayer.name}'S TIME 🏆`);
    console.log("~".repeat(40));
    
    this.displayEnhancedStats(currentPlayer);
    console.log();
  }
  
  static displayGameStart() {
    console.log("\n" + "=".repeat(60));
    console.log("🎮                RPG BATTLE ARENA                🎮");
    console.log("⚔️              FIGHT TO THE DEATH!              ⚔️");
    console.log("=".repeat(60));
  }
  
  static displayWinner(winner) {
    const className = winner.constructor.name;
    const icon = this.getClassIcon(className);
    
    console.log("\n" + "🎉".repeat(20));
    console.log(`🏆 VICTORY! ${icon} ${winner.name} the ${className} WINS! 🏆`);
    console.log("🎉".repeat(20));
    
    this.displayEnhancedStats(winner);
    console.log("\n🎊 Congratulations on your triumph! 🎊\n");
  }
}

export default UIManager;