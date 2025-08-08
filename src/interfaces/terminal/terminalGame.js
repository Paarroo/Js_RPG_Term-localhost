import {
  Fighter,
  Paladin,
  Monk,
  Berzerker,
  Assassin,
  Wizard,
  Valkyrie
} from '../../shared/characters/index.js';
import { RandomGenerator } from '../../shared/randomGenerator.js';
import { UIManager } from './uiManager.js';

export class TerminalGame {
  constructor() {
    this.initializeDefaultParty();

    this.turnLeft = 10; // Default 10 turns
    this.currentTurn = 1;
    this.useEnhancedUI = false; // Toggle for enhanced interface
  }

  initializeDefaultParty() {
    this.grace = new Fighter("Grace");
    this.ulder = new Paladin("Ulder");
    this.moana = new Monk("Moana");
    this.draven = new Berzerker("Draven");
    this.carl = new Assassin("Carl");

    this.players = [this.grace, this.ulder, this.moana, this.draven, this.carl];
  }

  initializeRandomParty() {
    this.players = RandomGenerator.generateRandomParty();
  }

  initializeBalancedParty() {
    this.players = RandomGenerator.generateBalancedParty();
  }

  setEnhancedUI(enabled = true) {
    this.useEnhancedUI = enabled;
  }

  async selectPlayerCharacter() {
    console.log("\n🎮 Choose your character to control:");
    this.players.forEach((player, index) => {
      const className = player.constructor.name;
      console.log(`${index + 1}. ${player.name} (${className})`);
    });

    const choice = await this.getUserChoice(this.players.length);
    const selectedPlayer = this.players[choice - 1];
    
    selectedPlayer.isPlayerControlled = true;
    
    console.log(`\n✅ You will control ${selectedPlayer.name} the ${selectedPlayer.constructor.name}!`);
    console.log("🤖 All other characters will be controlled by AI\n");
    
    return selectedPlayer;
  }

  async startGame() {
    await this.selectPlayerCharacter();
    
    if (this.useEnhancedUI) {
      UIManager.displayGameStart();
      UIManager.displayAllEnhanced(this.players);
    } else {
      console.log("=== RPG GAME STARTS ===");
      console.log("5 gladiators will fight to death!");
      console.log("Game lasts 10 turns maximum.");
      console.log("You control 1 character, AI controls the rest!\n");

      this.watchStats();
    }

    while (this.turnLeft > 0 && this.getAlivePlayers().length > 1) {
      await this.startTurn();
      await this.skipTurn();
    }

    this.endGame();
  }

  watchStats() {
    console.log("\n=== PLAYER STATS ===");
    this.players.forEach(player => {
      player.displayStats();
    });
    console.log("====================\n");
  }

  getAlivePlayers() {
    return this.players.filter(player => !player.isDead());
  }

  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  waitForEnter() {
    return new Promise(async (resolve) => {
      const { createInterface } = await import('readline');
      const readline = createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      readline.question('', () => {
        readline.close();
        resolve();
      });
    });
  }

  async getUserChoice(maxChoice) {
    return new Promise(async (resolve) => {
      const { createInterface } = await import('readline');
      const readline = createInterface({
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

  async startTurn() {
    if (this.useEnhancedUI) {
      console.log(`\n🏆 === TURN ${this.currentTurn} === 🏆`);
    } else {
      console.log(`\n=== It's turn ${this.currentTurn} ===`);
    }

    const alivePlayers = this.getAlivePlayers();
    const shuffledPlayers = this.shuffleArray([...alivePlayers]);

    for (const player of shuffledPlayers) {
      if (player.isDead()) continue;

      if (this.useEnhancedUI) {
        UIManager.displayTurnHeader(this.currentTurn, player);
      } else {
        console.log(`\nIt's time for ${player.name} to play.`);
      }

      if (player.isPlayerControlled) {
        await this.playerTurn(player);
        console.log(`\n⏸️  Press ENTER to continue...`);
        await this.waitForEnter();
      } else {
        await this.aiTurn(player);
      }

      if (player instanceof Assassin) {
        player.applyShadowHitCounterDamage();
      }

      if (this.getAlivePlayers().length <= 1) return;
    }
  }

  async skipTurn() {
    this.turnLeft--;
    this.currentTurn++;

    const alivePlayers = this.getAlivePlayers();

    console.log(`\n--- End of turn ${this.currentTurn - 1} ---`);
    console.log("Players still alive:");
    alivePlayers.forEach(player => {
      const { name, hp, mana } = player;
      console.log(`- ${name}: ${hp} HP, ${mana} Mana`);
    });

    console.log(`Turns left: ${this.turnLeft}`);
    
    if (this.turnLeft > 0 && alivePlayers.length > 1) {
      console.log(`\n📊 End of turn summary. Press ENTER for next turn...`);
      await this.waitForEnter();
    }
  }

  async playerTurn(currentPlayer) {
    const { name } = currentPlayer;
    const targets = this.getAlivePlayers().filter(p => p !== currentPlayer);

    if (targets.length === 0) return;

    console.log(`\n${name}'s current stats:`);
    currentPlayer.displayStats();

    console.log(`\n${name} attacks!`);
    const target = targets[Math.floor(Math.random() * targets.length)];
    currentPlayer.dealDamage(target);
  }

  async aiTurn(currentPlayer) {
    const { name } = currentPlayer;
    const targets = this.getAlivePlayers().filter(p => p !== currentPlayer);
    
    if (targets.length === 0) return;

    console.log(`\n🤖 ${name} (AI) attacks!`);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const target = targets[Math.floor(Math.random() * targets.length)];
    currentPlayer.dealDamage(target);
    
    console.log(`\n⏸️  Press ENTER to continue...`);
    await this.waitForEnter();
  }

  endGame() {
    const alivePlayers = this.getAlivePlayers();

    console.log("\n=== GAME OVER ===");

    if (alivePlayers.length === 1) {
      const winner = alivePlayers[0];
      winner.status = "winner";
      if (this.useEnhancedUI) {
        UIManager.displayWinner(winner);
      } else {
        console.log(`${winner.name} is the sole survivor and WINS!`);
      }
    } else if (alivePlayers.length > 1) {
      console.log("Time's up! Multiple survivors:");
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

export default TerminalGame;