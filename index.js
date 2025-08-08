// Main entry point for the RPG game - DRY Version
import { TerminalGame } from './src/interfaces/terminal/terminalGame.js';

// Example usage - you can customize the game setup here

console.log("🎮 Welcome to the Enhanced RPG Battle Arena! 🎮\n");
console.log("Choose your game mode:\n");
console.log("1. Default mode (original 5 characters)");
console.log("2. Random party mode (5 random classes)"); 
console.log("3. Balanced party mode (one of each class)");
console.log("4. Enhanced UI mode (with visual improvements)");

// For demo purposes, let's create different game modes
// You can uncomment the one you want to use:

// === DEFAULT GAME ===
// const rpgGame = new TerminalGame();
// rpgGame.startGame();

// === RANDOM PARTY GAME ===
// const rpgGame = new TerminalGame();
// rpgGame.initializeRandomParty();
// rpgGame.startGame();

// === BALANCED PARTY GAME ===
// const rpgGame = new TerminalGame();
// rpgGame.initializeBalancedParty();
// rpgGame.startGame();

// === ENHANCED UI + RANDOM PARTY ===
const rpgGame = new TerminalGame();
rpgGame.initializeRandomParty();
rpgGame.setEnhancedUI(true);
rpgGame.startGame();