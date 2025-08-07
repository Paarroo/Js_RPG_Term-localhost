# 🎮 JavaScript RPG Battle Arena

A turn-based console RPG game featuring 7 unique character classes battling to the death in an arena setting.

## 🚀 Features

- **7 Character Classes**: Fighter, Paladin, Monk, Berzerker, Assassin, Wizard, Healer
- **Multiple Game Modes**: Default party, random party, balanced party
- **Enhanced UI**: Visual health/mana bars with class icons
- **Strategic Combat**: Each class has unique abilities and playstyles
- **Turn-based Gameplay**: 10-turn limit with victory conditions
- **Interactive Controls**: Player-controlled actions for all characters

## 📦 Installation

```bash
# Clone or download the project
cd S1_J3-4_JS_RPG

# No dependencies required - pure Node.js
node index.js
```

## 🎯 Character Classes

### ⚔️ Fighter
- **HP**: 14 | **DMG**: 4 | **Mana**: 45
- **Special**: Dark Vision (5 DMG + damage reduction shield)
- **Role**: Balanced attacker with defensive capabilities

### 🛡️ Paladin  
- **HP**: 16 | **DMG**: 3 | **Mana**: 160
- **Special**: Healing Lightning (4 DMG + heal 5 HP)
- **Role**: Tank with healing support

### ☯️ Monk
- **HP**: 10 | **DMG**: 2 | **Mana**: 200
- **Special**: Heal (restore 8 HP)
- **Role**: Support healer with longevity

### 🪓 Berzerker
- **HP**: 10 | **DMG**: 4 | **Mana**: 0
- **Special**: Rage (+1 permanent DMG, -1 HP)
- **Role**: High-risk, high-reward damage dealer

### 🗡️ Assassin
- **HP**: 8 | **DMG**: 6 | **Mana**: 30
- **Special**: Shadow Hit (7 DMG + immunity + counter-damage)
- **Role**: Glass cannon with evasive abilities

### 🔮 Wizard
- **HP**: 10 | **DMG**: 2 | **Mana**: 200
- **Special**: Fireball (7 DMG blast)
- **Role**: Burst damage caster

### 🚁 Valkyrie
- **HP**: 12 | **DMG**: 3 | **Mana**: 150
- **Special**: Missile Swarm (8 DMG blast)
- **Role**: Mobile attacker with highest damage ability

## 🎮 Game Modes

### Default Mode
Original 5 characters: Grace (Fighter), Ulder (Paladin), Moana (Monk), Draven (Berzerker), Carl (Assassin)

### Random Party Mode
5 randomly generated characters with random names and classes

### Balanced Party Mode  
One character from each available class (7 total)

### Enhanced UI Mode
Visual health/mana bars, class icons, and improved formatting

## 🎯 How to Play

1. **Turn Order**: Random each turn for tactical variety
2. **Actions**: Choose normal attack or special ability
3. **Target Selection**: Pick enemies to attack or allies to support
4. **Victory Conditions**:
   - Last survivor wins
   - After 10 turns: highest HP wins
   - Ties possible with equal HP

## 🏗️ Architecture

### DRY Principles
- **Centralized Configuration**: `gameConfig.js` contains all stats, costs, and messages
- **Inherited Methods**: Base `Character` class provides common functionality
- **Smart Constructors**: Auto-configuration based on class type
- **Reusable Components**: UI and random generation modules

### File Structure
```
├── character.js          # Base character class
├── fighter.js            # Fighter class implementation  
├── paladin.js            # Paladin class implementation
├── monk.js               # Monk class implementation
├── berzerker.js          # Berzerker class implementation
├── assassin.js           # Assassin class implementation
├── wizard.js             # Wizard class implementation
├── valkyrie.js           # Valkyrie class implementation
├── gameConfig.js         # Centralized game configuration
├── randomGenerator.js    # Random party generation
├── uiManager.js          # Enhanced UI components
├── game.js               # Main game orchestrator
└── index.js              # Entry point and game modes
```

### Core Design Patterns
- **Inheritance**: All classes extend base `Character`
- **Factory Pattern**: `RandomGenerator` creates characters
- **Strategy Pattern**: `UIManager` handles different display modes
- **Configuration Pattern**: `gameConfig.js` centralizes all data

## 🔧 Configuration

Edit `gameConfig.js` to modify:
- Character stats and balance
- Ability mana costs  
- Game messages and text
- New abilities and effects

## 🚀 Getting Started

Uncomment your preferred game mode in `index.js`:

```javascript
// Default original game
const rpgGame = new Game();
rpgGame.startGame();

// Random party with enhanced UI
const rpgGame = new Game();
rpgGame.initializeRandomParty();
rpgGame.setEnhancedUI(true);
rpgGame.startGame();
```

## 📊 Game Balance

All classes are balanced for competitive gameplay:
- **Damage Dealers**: High damage, lower survivability
- **Tanks**: High HP, moderate damage, utility
- **Support**: Healing abilities, team-focused
- **Specialists**: Unique mechanics and playstyles

Each class has distinct strengths, weaknesses, and strategic value in team composition.

---

⚔️  Built with ❤️ and JavaScript ES6

"Where classic RPG meets modern JavaScript development" ✨