// Import all character classes
const Fighter = require('./fighter');
const Paladin = require('./paladin');
const Monk = require('./monk');
const Berzerker = require('./berzerker');
const Assassin = require('./assassin');
const Wizard = require('./wizard');
const Healer = require('./healer');

// Import utility classes
const RandomGenerator = require('./randomGenerator');
const UIManager = require('./uiManager');

// Game class to orchestrate the RPG
class Game {
  constructor() {
    // Default: Create the 5 original characters
    this.initializeDefaultParty();
    
    // Game state according to specs
    this.turnLeft = 10; // Default 10 turns
    this.currentTurn = 1;
    this.useEnhancedUI = false; // Toggle for enhanced interface
  }
  
  // Initialize default party (original 5 characters)
  initializeDefaultParty() {
    this.grace = new Fighter("Grace");
    this.ulder = new Paladin("Ulder");
    this.moana = new Monk("Moana");
    this.draven = new Berzerker("Draven");
    this.carl = new Assassin("Carl");
    
    // Array of all players for easier management
    this.players = [this.grace, this.ulder, this.moana, this.draven, this.carl];
  }
  
  // Initialize random party
  initializeRandomParty() {
    this.players = RandomGenerator.generateRandomParty();
  }
  
  // Initialize balanced party (one of each class)
  initializeBalancedParty() {
    this.players = RandomGenerator.generateBalancedParty();
  }
  
  // Toggle enhanced UI
  setEnhancedUI(enabled = true) {
    this.useEnhancedUI = enabled;
  }

  // Start the game according to specs
  async startGame() {
    if (this.useEnhancedUI) {
      UIManager.displayGameStart();
      UIManager.displayAllEnhanced(this.players);
    } else {
      console.log("=== RPG GAME STARTS ===");
      console.log("5 gladiators will fight to death!");
      console.log("Game lasts 10 turns maximum.");
      console.log("You control all 5 characters!\n");
      
      this.watchStats();
    }
    
    // Game loop
    while (this.turnLeft > 0 && this.getAlivePlayers().length > 1) {
      await this.startTurn();
      await this.skipTurn();
    }
    
    this.endGame();
  }

  // Wait for user to press ENTER
  waitForEnter() {
    return new Promise((resolve) => {
      process.stdin.once('data', () => {
        resolve();
      });
    });
  }

  // Start turn method according to specs
  async startTurn() {
    if (this.useEnhancedUI) {
      console.log(`\n🏆 === TURN ${this.currentTurn} === 🏆`);
    } else {
      console.log(`\n=== It's turn ${this.currentTurn} ===`);
    }
    
    const alivePlayers = this.getAlivePlayers();
    
    // Random order for players each turn
    const shuffledPlayers = this.shuffleArray([...alivePlayers]);
    
    // Each player plays in random order
    for (const player of shuffledPlayers) {
      if (player.isDead()) continue; // Skip if died during this turn
      
      if (this.useEnhancedUI) {
        UIManager.displayTurnHeader(this.currentTurn, player);
      } else {
        console.log(`\nIt's time for ${player.name} to play.`);
      }
      
      await this.playerTurn(player);
      
      // Handle Assassin counter-damage after turn
      if (player instanceof Assassin) {
        player.applyShadowHitCounterDamage();
      }
      
      // Check if game should end (only 1 player left)
      if (this.getAlivePlayers().length <= 1) return;
    }
  }

  // Handle individual player turn with real player choice
  async playerTurn(currentPlayer) {
    const { name } = currentPlayer;
    const targets = this.getAlivePlayers().filter(p => p !== currentPlayer);
    
    if (targets.length === 0) return;
    
    // Show current player stats
    console.log(`\n${name}'s current stats:`);
    currentPlayer.displayStats();
    
    // Ask for attack type
    const attackChoice = await this.chooseAttackType(currentPlayer);
    
    if (attackChoice === 'special') {
      let success = false;
      
      // Special attacks that need targets
      if (currentPlayer instanceof Fighter) {
        const target = await this.chooseTarget(currentPlayer, targets);
        success = currentPlayer.darkVision(target);
      } else if (currentPlayer instanceof Paladin) {
        const target = await this.chooseTarget(currentPlayer, targets);
        success = currentPlayer.healingLightning(target);
      } else if (currentPlayer instanceof Assassin) {
        const target = await this.chooseTarget(currentPlayer, targets);
        success = currentPlayer.shadowHit(target);
      } else if (currentPlayer instanceof Monk) {
        success = currentPlayer.heal(); // No target needed
      } else if (currentPlayer instanceof Berzerker) {
        success = currentPlayer.rage(); // No target needed
      } else if (currentPlayer instanceof Wizard) {
        const target = await this.chooseTarget(currentPlayer, targets);
        success = currentPlayer.fireball(target);
      } else if (currentPlayer instanceof Healer) {
        // Mass Heal targets all allies
        success = currentPlayer.massHeal(this.players);
      }
      
      // If special attack failed, offer normal attack
      if (!success) {
        console.log(`\nSpecial attack failed! Do you want to use normal attack instead?`);
        console.log("1. Yes - Normal attack");
        console.log("2. No - Skip turn");
        
        const fallbackChoice = await this.getUserChoice(2);
        if (fallbackChoice === 1) {
          const target = await this.chooseTarget(currentPlayer, targets);
          currentPlayer.dealDamage(target);
        } else {
          console.log(`${name} skips the turn.`);
        }
      }
    } else {
      // Normal attack
      const target = await this.chooseTarget(currentPlayer, targets);
      currentPlayer.dealDamage(target);
    }
  }

  // Let player choose attack type
  async chooseAttackType(currentPlayer) {
    const { name } = currentPlayer;
    
    console.log(`\n${name}'s turn! Choose attack:`);
    console.log("1. Normal attack");
    
    // Show special attack option based on class
    if (currentPlayer instanceof Fighter) {
      console.log("2. Dark Vision (5 DMG + shield next turn) - 20 mana");
    } else if (currentPlayer instanceof Paladin) {
      console.log("2. Healing Lightning (4 DMG + heal 5 HP) - 40 mana");
    } else if (currentPlayer instanceof Monk) {
      console.log("2. Heal (restore 8 HP) - 25 mana");
    } else if (currentPlayer instanceof Berzerker) {
      console.log("2. Rage (+1 permanent DMG, -1 HP) - 0 mana");
    } else if (currentPlayer instanceof Assassin) {
      console.log("2. Shadow Hit (7 DMG + immunity) - 20 mana");
    } else if (currentPlayer instanceof Wizard) {
      console.log("2. Fireball (7 DMG blast) - 25 mana");
    } else if (currentPlayer instanceof Healer) {
      console.log("2. Mass Heal (heal all allies 3 HP) - 40 mana");
    }
    
    console.log("3. Watch Stats (see all players)");
    
    const choice = await this.getUserChoice(3);
    
    if (choice === 3) {
      if (this.useEnhancedUI) {
        UIManager.displayAllEnhanced(this.players);
      } else {
        this.watchStats();
      }
      // Ask again after showing stats
      return await this.chooseAttackType(currentPlayer);
    }
    
    return choice === 1 ? 'normal' : 'special';
  }

  // Let player choose target
  async chooseTarget(currentPlayer, targets) {
    console.log(`\nChoose target for ${currentPlayer.name}:`);
    targets.forEach((target, index) => {
      console.log(`${index + 1}. ${target.name} (${target.hp} HP)`);
    });
    
    const choice = await this.getUserChoice(targets.length);
    return targets[choice - 1];
  }

  // Get user choice with validation
  async getUserChoice(maxChoice) {
    return new Promise((resolve) => {
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      const askChoice = () => {
        readline.question(`Choose (1-${maxChoice}): `, (answer) => {
          const choice = parseInt(answer);
          if (choice >= 1 && choice <= maxChoice) {
            readline.close();
            resolve(choice);
          } else {
            console.log(`Please enter a number between 1 and ${maxChoice}.`);
            askChoice();
          }
        });
      };
      
      askChoice();
    });
  }

  // Skip turn method according to specs
  async skipTurn() {
    this.turnLeft--;
    this.currentTurn++;
    
    const alivePlayers = this.getAlivePlayers();
    
    console.log(`\n--- End of turn ${this.currentTurn - 1} ---`);
    console.log("Players still alive:");
    alivePlayers.forEach(player => {
      const { name, hp } = player;
      console.log(`- ${name}: ${hp} HP`);
    });
    
    console.log(`Turns left: ${this.turnLeft}`);
  }

  // Watch stats method according to specs
  watchStats() {
    console.log("\n=== PLAYER STATS ===");
    this.players.forEach(player => {
      player.displayStats();
    });
    console.log("====================\n");
  }

  // Get alive players
  getAlivePlayers() {
    return this.players.filter(player => !player.isDead());
  }

  // Shuffle array helper
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // End game and determine winners
  endGame() {
    const alivePlayers = this.getAlivePlayers();
    
    console.log("\n=== GAME OVER ===");
    
    if (alivePlayers.length === 1) {
      // One winner
      const winner = alivePlayers[0];
      winner.status = "winner";
      console.log(`${winner.name} is the sole survivor and WINS!`);
    } else if (alivePlayers.length > 1) {
      // Multiple survivors after 10 turns
      console.log("Time's up! Multiple survivors:");
      
      // Winner = highest HP
      let maxHp = 0;
      let winners = [];
      
      alivePlayers.forEach(player => {
        if (player.hp > maxHp) {
          maxHp = player.hp;
          winners = [player];
        } else if (player.hp === maxHp) {
          winners.push(player);
        }
      });
      
      winners.forEach(winner => {
        winner.status = "winner";
        console.log(`${winner.name} wins with ${winner.hp} HP!`);
      });
    } else {
      console.log("Everyone died! No winner.");
    }
    
    console.log("\nFinal stats:");
    this.watchStats();
  }
}

module.exports = Game;