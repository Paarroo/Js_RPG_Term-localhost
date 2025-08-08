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

export class WebGame {
    constructor() {
        this.players = [];
        this.currentTurn = 1;
        this.turnLeft = 10;
        this.selectedCharacter = null;
        this.gameMode = 'default';
        this.currentPlayer = null;
        this.gamePhase = 'setup';
        this.isPlayerTurn = false;
        this.initialized = false;
    }

    initialize() {
        if (this.initialized) return;
        this.initialized = true;

        this.setupEventListeners();
        this.populateCharacterSelection();
    }

    setupEventListeners() {
        const characterSelection = document.getElementById('character-selection');
        const startBtn = document.getElementById('start-game');

        characterSelection?.addEventListener('click', (e) => {
            if (e.target.closest('.character-card')) {
                this.selectCharacter(e.target.closest('.character-card'));
            }
        });

        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.gameMode = e.target.dataset.mode;
                this.populateCharacterSelection();
                this.selectedCharacter = null;
                if (startBtn) startBtn.disabled = true;
            });
        });

        startBtn?.addEventListener('click', () => {
            this.startGame();
        });
    }

    populateCharacterSelection() {
        const container = document.getElementById('character-selection');
        if (!container) return;

        container.innerHTML = '';

        let characters = [];
        
        switch(this.gameMode) {
            case 'random':
                characters = RandomGenerator.generateRandomParty();
                break;
            case 'balanced':
                characters = RandomGenerator.generateBalancedParty();
                break;
            default:
                characters = [
                    new Fighter("Grace"),
                    new Paladin("Ulder"),
                    new Monk("Moana"),
                    new Berzerker("Draven"),
                    new Assassin("Carl")
                ];
        }

        this.players = characters;

        characters.forEach((character, index) => {
            const card = this.createCharacterCard(character, index);
            container.appendChild(card);
        });
    }

    createCharacterCard(character, index) {
        const card = document.createElement('div');
        card.className = 'character-card';
        card.dataset.index = index;

        const className = character.constructor.name;
        const icons = {
            Fighter: '⚔️',
            Paladin: '🛡️',
            Monk: '☯️',
            Berzerker: '🪓',
            Assassin: '🗡️',
            Wizard: '🔮',
            Valkyrie: '🚁'
        };

        card.innerHTML = `
            <div class="character-icon">${icons[className] || '❓'}</div>
            <h3>${character.name}</h3>
            <p class="character-class">${className}</p>
            <div class="character-stats">
                <div class="stat">
                    <span class="stat-label">HP:</span>
                    <span class="stat-value">${character.hp}/${character.maxHp}</span>
                </div>
                <div class="stat">
                    <span class="stat-label">DMG:</span>
                    <span class="stat-value">${character.dmg}</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Mana:</span>
                    <span class="stat-value">${character.mana}</span>
                </div>
            </div>
        `;

        return card;
    }

    selectCharacter(cardElement) {
        const index = parseInt(cardElement.dataset.index);
        
        document.querySelectorAll('.character-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        cardElement.classList.add('selected');
        
        this.selectedCharacter = this.players[index];
        this.selectedCharacter.isPlayerControlled = true;
        
        const startBtn = document.getElementById('start-game');
        if (startBtn) startBtn.disabled = false;
    }

    startGame() {
        if (!this.selectedCharacter) return;

        this.gamePhase = 'battle';
        this.showBattleInterface();
        this.runGameLoop();
    }

    showBattleInterface() {
        const setupPhase = document.getElementById('setup-phase');
        const battlePhase = document.getElementById('battle-phase');
        
        if (setupPhase) setupPhase.style.display = 'none';
        if (battlePhase) battlePhase.style.display = 'block';
        
        this.updateBattleDisplay();
    }

    updateBattleDisplay() {
        this.updatePlayersGrid();
        this.updateTurnInfo();
        this.updateCombatLog(`Turn ${this.currentTurn} begins!`);
    }

    updatePlayersGrid() {
        const grid = document.getElementById('players-grid');
        if (!grid) return;

        grid.innerHTML = '';

        this.players.forEach(player => {
            const playerCard = this.createPlayerBattleCard(player);
            grid.appendChild(playerCard);
        });
    }

    createPlayerBattleCard(player) {
        const card = document.createElement('div');
        card.className = `player-card ${player.isDead() ? 'dead' : ''} ${player.isPlayerControlled ? 'controlled' : ''}`;
        
        const className = player.constructor.name;
        const icons = {
            Fighter: '⚔️',
            Paladin: '🛡️',
            Monk: '☯️',
            Berzerker: '🪓',
            Assassin: '🗡️',
            Wizard: '🔮',
            Valkyrie: '🚁'
        };

        const hpPercent = (player.hp / player.maxHp) * 100;

        card.innerHTML = `
            <div class="player-header">
                <div class="player-icon">${icons[className] || '❓'}</div>
                <div class="player-info">
                    <h4>${player.name}</h4>
                    <p class="player-class">${className}</p>
                    ${player.isPlayerControlled ? '<span class="controlled-indicator">👤 You</span>' : '<span class="ai-indicator">🤖 AI</span>'}
                </div>
            </div>
            <div class="health-bar">
                <div class="health-fill" style="width: ${hpPercent}%"></div>
                <span class="health-text">${player.hp}/${player.maxHp}</span>
            </div>
            <div class="player-stats">
                <span>DMG: ${player.dmg}</span>
                <span>Mana: ${player.mana}</span>
            </div>
        `;

        return card;
    }

    updateTurnInfo() {
        const turnInfo = document.getElementById('turn-info');
        if (turnInfo) {
            turnInfo.textContent = `Turn ${this.currentTurn} / 10`;
        }
    }

    updateCombatLog(message) {
        const log = document.getElementById('combat-log');
        if (!log) return;

        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        logEntry.textContent = message;
        
        log.appendChild(logEntry);
        log.scrollTop = log.scrollHeight;
    }

    async runGameLoop() {
        while (this.turnLeft > 0 && this.getAlivePlayers().length > 1) {
            await this.playTurn();
            this.endTurn();
        }
        
        this.endGame();
    }

    async playTurn() {
        const alivePlayers = this.getAlivePlayers();
        const shuffledPlayers = this.shuffleArray([...alivePlayers]);

        for (const player of shuffledPlayers) {
            if (player.isDead()) continue;

            this.currentPlayer = player;
            this.updateCombatLog(`${player.name} is taking their turn...`);

            if (player.isPlayerControlled) {
                await this.playerTurn(player);
            } else {
                await this.aiTurn(player);
            }

            this.updateBattleDisplay();
            await this.sleep(1000);

            if (this.getAlivePlayers().length <= 1) return;
        }
    }

    async playerTurn(player) {
        const targets = this.getAlivePlayers().filter(p => p !== player);
        if (targets.length === 0) return;

        const target = targets[Math.floor(Math.random() * targets.length)];
        this.updateCombatLog(`You (${player.name}) attack ${target.name}!`);
        player.dealDamage(target);
        
        if (target.isDead()) {
            this.updateCombatLog(`${target.name} is defeated!`);
        }
    }

    async aiTurn(player) {
        const targets = this.getAlivePlayers().filter(p => p !== player);
        if (targets.length === 0) return;

        const target = targets[Math.floor(Math.random() * targets.length)];
        this.updateCombatLog(`${player.name} (AI) attacks ${target.name}!`);
        
        await this.sleep(500);
        player.dealDamage(target);
        
        if (target.isDead()) {
            this.updateCombatLog(`${target.name} is defeated!`);
        }
    }

    endTurn() {
        this.currentTurn++;
        this.turnLeft--;
        this.updateCombatLog(`--- End of turn ${this.currentTurn - 1} ---`);
    }

    endGame() {
        this.gamePhase = 'ended';
        const alivePlayers = this.getAlivePlayers();

        if (alivePlayers.length === 1) {
            const winner = alivePlayers[0];
            this.updateCombatLog(`🏆 ${winner.name} wins the battle!`);
        } else if (alivePlayers.length > 1) {
            this.updateCombatLog("⏰ Time's up! Multiple survivors!");
        } else {
            this.updateCombatLog("💀 Everyone died!");
        }
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

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Default export for compatibility
export default WebGame;