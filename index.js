// Main entry point for the RPG game - DRY Version
import { TerminalGame } from './src/interfaces/terminal/terminalGame.js';

// Example usage - you can customize the game setup here

console.log("🎮 Welcome to the Enhanced RPG Battle Arena! 🎮\n");
console.log("🎯 Starting in Enhanced UI + Random Party mode...");

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