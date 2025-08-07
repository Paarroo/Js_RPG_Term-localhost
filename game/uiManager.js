// UI Manager for enhanced visual display
class UIManager {
  // Display health bar with visual representation
  static displayHealthBar(character) {
    const { hp, maxHp } = character;
    const barLength = 10;
    const fillLength = Math.round((hp / maxHp) * barLength);
    const emptyLength = barLength - fillLength;
    
    const filledBar = '█'.repeat(fillLength);
    const emptyBar = '░'.repeat(emptyLength);
    
    return `${filledBar}${emptyBar} (${hp}/${maxHp})`;
  }
  
  // Display mana bar with visual representation
  static displayManaBar(character) {
    const { mana } = character;
    const maxMana = character.maxMana || 200; // Fallback for classes without maxMana
    const barLength = 10;
    const fillLength = Math.round((mana / maxMana) * barLength);
    const emptyLength = barLength - fillLength;
    
    const filledBar = '█'.repeat(fillLength);
    const emptyBar = '░'.repeat(emptyLength);
    
    return `${filledBar}${emptyBar} (${mana}/${maxMana})`;
  }
  
  // Get class icon for visual representation
  static getClassIcon(className) {
    const icons = {
      Fighter: '⚔️',
      Paladin: '🛡️',
      Monk: '☯️',
      Berzerker: '🪓',
      Assassin: '🗡️',
      Wizard: '🔮',
      Valkyrie: '🚁'
    };
    
    return icons[className] || '❓';
  }
  
  // Enhanced stats display with visual elements
  static displayEnhancedStats(character) {
    const className = character.constructor.name;
    const icon = this.getClassIcon(className);
    const { name, hp, dmg, mana, status } = character;
    
    console.log(`\n${icon} ${name} (${className}) [${status.toUpperCase()}]`);
    console.log(`   HP:   ${this.displayHealthBar(character)}`);
    console.log(`   Mana: ${this.displayManaBar(character)}`);
    console.log(`   DMG:  ${dmg} points`);
    
    // Display special effects if character has them
    if (typeof character.displaySpecialEffects === 'function') {
      character.displaySpecialEffects();
    }
  }
  
  // Display all characters with enhanced formatting
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
  
  // Display turn header with enhanced formatting
  static displayTurnHeader(turnNumber, currentPlayer) {
    const className = currentPlayer.constructor.name;
    const icon = this.getClassIcon(className);
    
    console.log("\n" + "~".repeat(40));
    console.log(`    🏆 TURN ${turnNumber} - ${icon} ${currentPlayer.name}'S TIME 🏆`);
    console.log("~".repeat(40));
    
    this.displayEnhancedStats(currentPlayer);
    console.log();
  }
  
  // Display game start header
  static displayGameStart() {
    console.log("\n" + "=".repeat(60));
    console.log("🎮                RPG BATTLE ARENA                🎮");
    console.log("⚔️              FIGHT TO THE DEATH!              ⚔️");
    console.log("=".repeat(60));
  }
  
  // Display winner with celebration
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

module.exports = UIManager;