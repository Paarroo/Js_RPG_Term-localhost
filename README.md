# 🎮 JavaScript RPG Battle Arena

A turn-based RPG game featuring 7 unique character classes battling to the death in an arena setting. Available in both **terminal** and **web** versions with identical gameplay mechanics.

## 🚀 Features

- **Dual Platform**: Terminal console and web browser versions
- **7 Character Classes**: Fighter, Paladin, Monk, Berzerker, Assassin, Wizard, Valkyrie
- **Multiple Game Modes**: Classic, Random Team, Balanced Team, Enhanced Interface
- **Enhanced UI**: Visual health/mana bars with class icons (web version)
- **Strategic Combat**: Each class has unique abilities and playstyles
- **Turn-based Gameplay**: 10-turn limit with victory conditions
- **Interactive Controls**: Player-controlled actions with AI opponents
- **Mortal Kombat Styling**: Dark theme with gold accents (web version)

## 📦 Installation

```bash
# Clone or download the project
cd S1_J3-4_JS_RPG

# Install dependencies (optional - for SCSS compilation)
npm install

# Run terminal version
npm run terminal
# OR
node index.js

# Open web version
npm run web
# OR
open index.html

# Compile SCSS (if making style changes)
npm run build
```

## 📸 Screenshots

### Web Version
![Character Selection](assets/screenshots/web-character-selection.png)
*Mortal Kombat-styled character selection with multiple game modes*

![Battle Arena](assets/screenshots/web-battle-arena.png)
*Real-time battle interface with visual HP/Mana bars and combat log*

### Terminal Version  
![Character Selection](assets/screenshots/terminal-character-select.png)
*Console-based character selection with AI-controlled opponents*

![Terminal Battle](assets/screenshots/terminal-battle.png)
*Turn-based combat with detailed statistics and AI decision making*

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
S1_J3-4_JS_RPG/
├── package.json
├── .gitignore
├── README.md
├── index.html                # Web interface
├── index.js                  # Terminal entry point
│
├── characters/               # Character classes
│   ├── character.js          # Base class
│   ├── fighter.js
│   ├── paladin.js
│   ├── monk.js
│   ├── berzerker.js
│   ├── assassin.js
│   ├── wizard.js
│   └── valkyrie.js
│
├── game/                     # Terminal game logic
│   ├── game.js               # Main orchestrator
│   ├── gameConfig.js
│   ├── randomGenerator.js
│   └── uiManager.js
│
├── web/                      # Web version
│   ├── webGame.js
│   ├── gameConfig.js
│   └── characters/
│       ├── character.js
│       ├── fighter.js
│       ├── paladin.js
│       ├── monk.js
│       ├── berzerker.js
│       ├── assassin.js
│       ├── wizard.js
│       └── valkyrie.js
│
├── assets/
│   └── styles/               # SCSS source
│       ├── application.scss
│       ├── _variables.scss
│       ├── _base.scss
│       ├── _components.scss
│       ├── _mixins.scss
│       └── _animations.scss
│
└── dist/                     # Compiled CSS
    ├── application.css
    └── application.css.map
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