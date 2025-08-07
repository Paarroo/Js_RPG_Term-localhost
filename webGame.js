// Web-based RPG Game Controller
class WebGame {
    constructor() {
        this.players = [];
        this.currentTurn = 1;
        this.turnLeft = 10;
        this.selectedCharacter = null;
        this.gameMode = 'default';
        this.currentPlayer = null;
        this.gamePhase = 'setup'; // 'setup', 'character-select', 'battle', 'ended'
        this.isPlayerTurn = false;
        this.targetSelection = false;
        this.availableTargets = [];
        this.pendingAction = null;
        this.initialized = false;
    }

    initialize() {
        // Prevent multiple initializations
        if (this.initialized) return;
        this.initialized = true;
        
        this.setupEventListeners();
        this.populateCharacterSelection();
    }

    setupEventListeners() {
        // Remove any existing event listeners by cloning elements
        const characterSelection = document.getElementById('character-selection');
        const startBtn = document.getElementById('start-game');
        const actions = document.getElementById('actions');
        const playersGrid = document.getElementById('players-grid');
        
        // Character selection  
        characterSelection.addEventListener('click', (e) => {
            if (e.target.closest('.character-card')) {
                console.log('🔧 Character card clicked');
                this.selectCharacter(e.target.closest('.character-card'));
            }
        });

        // Game mode buttons
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.gameMode = e.target.dataset.mode;
                this.populateCharacterSelection(); // Refresh character selection based on mode
                this.selectedCharacter = null; // Reset selection
                document.getElementById('start-game').disabled = true; // Disable start button
            });
        });

        // Start game button
        startBtn.addEventListener('click', () => {
            console.log('🔧 Start button clicked');
            this.startGame();
        });

        // Action buttons
        actions.addEventListener('click', (e) => {
            if (e.target.classList.contains('action-btn')) {
                console.log('🔧 Action button clicked:', e.target.dataset.action);
                this.handleAction(e.target.dataset.action);
            }
        });

        // Player cards for target selection
        playersGrid.addEventListener('click', (e) => {
            if (e.target.closest('.player-card') && this.targetSelection) {
                console.log('🔧 Target selected');
                this.selectTarget(e.target.closest('.player-card'));
            }
        });
    }

    populateCharacterSelection() {
        const container = document.getElementById('character-selection');
        const allCharacters = [
            { name: 'Grace', class: 'Fighter', icon: '⚔️', special: 'Dark Vision' },
            { name: 'Ulder', class: 'Paladin', icon: '🛡️', special: 'Healing Lightning' },
            { name: 'Moana', class: 'Monk', icon: '☯️', special: 'Heal' },
            { name: 'Draven', class: 'Berzerker', icon: '🪓', special: 'Rage' },
            { name: 'Carl', class: 'Assassin', icon: '🗡️', special: 'Shadow Hit' },
            { name: 'Merlin', class: 'Wizard', icon: '🔮', special: 'Fireball' },
            { name: 'Nova', class: 'Valkyrie', icon: '🚁', special: 'Missile Swarm' }
        ];

        // Get available characters based on current mode
        let characters;
        switch(this.gameMode) {
            case 'default':
                characters = allCharacters.slice(0, 5); // First 5 characters
                break;
            case 'random':
                characters = this.shuffleArray([...allCharacters]).slice(0, 5); // Random 5
                break;
            case 'balanced':
                characters = [
                    allCharacters[0], // Fighter
                    allCharacters[1], // Paladin  
                    allCharacters[2], // Monk
                    allCharacters[4], // Assassin
                    allCharacters[5]  // Wizard
                ];
                break;
            case 'enhanced':
                characters = allCharacters; // All 7 characters
                break;
            default:
                characters = allCharacters;
        }

        container.innerHTML = characters.map((char, index) => {
            const stats = CHARACTER_STATS[char.class];
            return `
                <div class="character-card" data-index="${index}" data-class="${char.class}">
                    <div class="character-icon">${char.icon}</div>
                    <div class="character-name">${char.name}</div>
                    <div class="character-class">${char.class}</div>
                    <div class="character-stats">
                        HP: ${stats.hp} | DMG: ${stats.dmg} | Mana: ${stats.mana}
                    </div>
                    <div class="character-special">${char.special}</div>
                </div>
            `;
        }).join('');
    }

    selectCharacter(card) {
        // Prevent multiple selections during game
        if (this.gamePhase !== 'setup') return;
        
        // Remove previous selection
        document.querySelectorAll('.character-card').forEach(c => c.classList.remove('selected'));
        
        // Select new character
        card.classList.add('selected');
        this.selectedCharacter = parseInt(card.dataset.index);
        
        // Enable start button
        document.getElementById('start-game').disabled = false;
        
        this.log(`You chose ${card.querySelector('.character-name').textContent}!`);
    }

    startGame() {
        if (this.selectedCharacter === null) return;
        if (this.gamePhase !== 'setup') return; // Prevent multiple starts

        this.gamePhase = 'character-select';

        // Hide setup, show arena
        document.getElementById('game-setup').style.display = 'none';
        document.getElementById('game-arena').style.display = 'block';

        // Initialize players based on game mode
        this.initializePlayers();
        
        console.log(`🔧 DEBUG: selectedCharacter index: ${this.selectedCharacter}, players length: ${this.players.length}`);
        console.log(`🔧 DEBUG: players array:`, this.players.map(p => `${p.name} (${p.constructor.name})`));
        
        // Ensure selected character index is valid
        if (this.selectedCharacter >= this.players.length) {
            console.error(`❌ Selected character index ${this.selectedCharacter} is out of bounds!`);
            this.log(`❌ Erreur de sélection de personnage !`);
            return;
        }
        
        // Set player control
        const selectedPlayer = this.players[this.selectedCharacter];
        if (!selectedPlayer) {
            console.error(`❌ No player found at index ${this.selectedCharacter}!`);
            this.log(`❌ Personnage introuvable !`);
            return;
        }
        
        selectedPlayer.isPlayerControlled = true;
        
        this.log(`🎮 Battle begins! You control ${selectedPlayer.name}.`);
        this.log(`🤖 AI controls other characters.`);
        
        // Start game loop
        this.updateDisplay();
        this.gamePhase = 'battle';
        
        setTimeout(() => this.nextTurn(), 1000);
    }

    initializePlayers() {
        const allCharacters = [
            { name: 'Grace', class: 'Fighter' },
            { name: 'Ulder', class: 'Paladin' }, 
            { name: 'Moana', class: 'Monk' },
            { name: 'Draven', class: 'Berzerker' },
            { name: 'Carl', class: 'Assassin' },
            { name: 'Merlin', class: 'Wizard' },
            { name: 'Nova', class: 'Valkyrie' }
        ];

        let selectedCharacters;
        
        switch(this.gameMode) {
            case 'default':
                selectedCharacters = allCharacters.slice(0, 5); // First 5 characters
                break;
            case 'random':
                selectedCharacters = this.shuffleArray([...allCharacters]).slice(0, 5); // Random 5
                break;
            case 'balanced':
                // One of each class type (balanced team)
                selectedCharacters = [
                    allCharacters[0], // Fighter
                    allCharacters[1], // Paladin  
                    allCharacters[2], // Monk
                    allCharacters[4], // Assassin
                    allCharacters[5]  // Wizard
                ];
                break;
            case 'enhanced':
                selectedCharacters = allCharacters; // All 7 characters
                break;
            default:
                selectedCharacters = allCharacters; // Fallback to all
        }

        // Create players based on selected characters
        this.players = selectedCharacters.map(char => 
            this.createCharacterByClass(char.name, char.class)
        ).filter(player => player !== null);
        
        console.log(`🔧 Created ${this.players.length} players total for ${this.gameMode} mode`);
    }

    createCharacterByClass(name, className) {
        const classMap = {
            Fighter: () => new Fighter(name),
            Paladin: () => new Paladin(name),
            Monk: () => new Monk(name),
            Berzerker: () => new Berzerker(name),
            Assassin: () => new Assassin(name),
            Wizard: () => new Wizard(name),
            Valkyrie: () => new Valkyrie(name)
        };
        
        console.log(`🔧 Creating character: ${name} as ${className}`);
        
        if (!classMap[className]) {
            console.error(`❌ Unknown character class: ${className}`);
            return null;
        }
        
        try {
            const character = classMap[className]();
            console.log(`✅ Created ${name}: HP=${character.hp}, DMG=${character.dmg}, Mana=${character.mana}`);
            return character;
        } catch (error) {
            console.error(`❌ Error creating ${name} (${className}):`, error);
            return null;
        }
    }

    updateDisplay() {
        this.updateTurnInfo();
        this.updatePlayersGrid();
    }

    updateTurnInfo() {
        document.getElementById('turn-counter').textContent = `Turn ${this.currentTurn}`;
        document.getElementById('turns-left').textContent = `${this.turnLeft} turns left`;
    }

    updatePlayersGrid() {
        const container = document.getElementById('players-grid');
        const icons = {
            Fighter: '⚔️', Paladin: '🛡️', Monk: '☯️', Berzerker: '🪓', 
            Assassin: '🗡️', Wizard: '🔮', Valkyrie: '🚁'
        };

        container.innerHTML = this.players.map((player, index) => {
            const className = player.constructor.name;
            const icon = icons[className];
            const isCurrentTurn = this.currentPlayer === player;
            const isDead = player.isDead();
            const isPlayerControlled = player.isPlayerControlled;
            
            const healthPercent = (player.hp / player.maxHp) * 100;
            const manaPercent = player.maxMana ? (player.mana / player.maxMana) * 100 : 0;

            let cardClass = 'player-card';
            if (isCurrentTurn) cardClass += ' current-turn';
            if (isDead) cardClass += ' dead';

            return `
                <div class="${cardClass}" data-index="${index}">
                    <div class="character-icon">${icon}</div>
                    <div class="character-name">
                        ${player.name} ${isPlayerControlled ? '(You)' : '(AI)'}
                    </div>
                    <div class="character-class">${className}</div>
                    
                    <div class="health-bar">
                        <div class="health-fill" style="width: ${healthPercent}%"></div>
                    </div>
                    <div style="font-size: 0.8rem;">HP: ${player.hp}/${player.maxHp}</div>
                    
                    ${player.maxMana ? `
                        <div class="mana-bar">
                            <div class="mana-fill" style="width: ${manaPercent}%"></div>
                        </div>
                        <div style="font-size: 0.8rem;">Mana: ${player.mana}/${player.maxMana}</div>
                    ` : ''}
                    
                    <div style="font-size: 0.8rem; margin-top: 5px;">
                        DMG: ${player.dmg} | Status: ${player.status}
                    </div>
                </div>
            `;
        }).join('');
    }

    async nextTurn() {
        if (this.gamePhase !== 'battle') return;
        
        const alivePlayers = this.players.filter(p => !p.isDead());
        
        // Check win conditions
        if (alivePlayers.length <= 1) {
            this.endGame();
            return;
        }
        
        if (this.turnLeft <= 0) {
            this.endGame();
            return;
        }

        // Shuffle alive players for random turn order
        const shuffledPlayers = this.shuffleArray([...alivePlayers]);
        
        for (const player of shuffledPlayers) {
            if (player.isDead()) continue;
            
            this.currentPlayer = player;
            this.updateDisplay();
            
            if (player.isPlayerControlled) {
                await this.playerTurn(player);
            } else {
                await this.aiTurn(player);
            }
            
            // Check if game should end
            const stillAlive = this.players.filter(p => !p.isDead());
            if (stillAlive.length <= 1) {
                this.endGame();
                return;
            }
        }
        
        // End turn
        this.currentTurn++;
        this.turnLeft--;
        this.currentPlayer = null;
        this.updateDisplay();
        
        setTimeout(() => this.nextTurn(), 1500);
    }

    async playerTurn(player) {
        this.isPlayerTurn = true;
        this.log(`🎮 Your turn with ${player.name}!`);
        
        // Show action buttons
        document.getElementById('actions').classList.remove('hidden');
        
        // Wait for player action
        return new Promise((resolve) => {
            this.playerTurnResolve = resolve;
        });
    }

    handleAction(action) {
        console.log(`🔧 DEBUG: handleAction called with "${action}", isPlayerTurn: ${this.isPlayerTurn}, currentPlayer: ${this.currentPlayer?.name}`);
        
        if (!this.isPlayerTurn) {
            console.log(`🚫 Not player turn, ignoring action`);
            return;
        }
        
        const player = this.currentPlayer;
        
        if (action === 'stats') {
            this.showStats();
            return;
        }
        
        if (action === 'normal') {
            this.pendingAction = 'normal';
            this.startTargetSelection();
        } else if (action === 'special') {
            this.pendingAction = 'special';
            if (this.needsTarget(player, 'special')) {
                this.startTargetSelection();
            } else {
                this.executeAction('special', null);
            }
        }
    }

    needsTarget(player, actionType) {
        if (actionType === 'normal') return true;
        
        const className = player.constructor.name;
        return !(['Monk', 'Berzerker'].includes(className));
    }

    startTargetSelection() {
        this.targetSelection = true;
        this.availableTargets = this.players.filter(p => 
            !p.isDead() && p !== this.currentPlayer
        );
        
        this.log('🎯 Select a target by clicking on their card...');
        
        // Highlight available targets
        document.querySelectorAll('.player-card').forEach((card, index) => {
            if (this.availableTargets.includes(this.players[index])) {
                card.style.border = '2px solid #ffd700';
                card.style.cursor = 'pointer';
            }
        });
    }

    selectTarget(card) {
        if (!this.targetSelection) return;
        
        const index = parseInt(card.dataset.index);
        const target = this.players[index];
        
        if (!this.availableTargets.includes(target)) return;
        
        // Clear target selection
        this.targetSelection = false;
        document.querySelectorAll('.player-card').forEach(c => {
            c.style.border = '';
            c.style.cursor = '';
        });
        
        this.executeAction(this.pendingAction, target);
    }

    executeAction(actionType, target) {
        const player = this.currentPlayer;
        
        if (actionType === 'normal') {
            player.dealDamage(target);
            this.log(`⚔️ ${player.name} attacks ${target.name}!`);
        } else if (actionType === 'special') {
            this.executeSpecialAttack(player, target);
        }
        
        this.endPlayerTurn();
    }

    executeSpecialAttack(player, target) {
        const className = player.constructor.name;
        let success = false;
        
        if (className === 'Fighter' && target) {
            success = player.darkVision(target);
        } else if (className === 'Paladin' && target) {
            success = player.healingLightning(target);
        } else if (className === 'Monk') {
            success = player.heal();
        } else if (className === 'Berzerker') {
            success = player.rage();
        } else if (className === 'Assassin' && target) {
            success = player.shadowHit(target);
        } else if (className === 'Wizard' && target) {
            success = player.fireball(target);
        } else if (className === 'Valkyrie' && target) {
            success = player.missileSwarm(target);
        }
        
        if (!success) {
            this.log(`❌ ${player.name} cannot use this special attack!`);
            // Fallback to normal attack if target available
            if (target) {
                player.dealDamage(target);
                this.log(`⚔️ ${player.name} uses normal attack instead!`);
            }
        }
    }

    endPlayerTurn() {
        this.isPlayerTurn = false;
        document.getElementById('actions').classList.add('hidden');
        
        if (this.playerTurnResolve) {
            this.playerTurnResolve();
            this.playerTurnResolve = null;
        }
    }

    async aiTurn(player) {
        this.log(`🤖 ${player.name} (AI) is thinking...`);
        
        // Wait for dramatic effect
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const targets = this.players.filter(p => !p.isDead() && p !== player);
        if (targets.length === 0) return;
        
        // AI decision logic (simplified version)
        const decision = this.makeAIDecision(player, targets);
        
        if (decision.type === 'special') {
            this.log(`🤖 ${player.name} uses special attack!`);
            this.executeSpecialAttack(player, decision.target);
        } else {
            this.log(`🤖 ${player.name} attacks ${decision.target.name}!`);
            player.dealDamage(decision.target);
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    makeAIDecision(player, targets) {
        // Simple AI: check for lethal first
        for (const target of targets) {
            if (target.hp <= player.dmg) {
                return { type: 'normal', target: target };
            }
        }
        
        // Random attack
        const target = targets[Math.floor(Math.random() * targets.length)];
        const useSpecial = Math.random() > 0.4 && this.canUseSpecial(player);
        
        return {
            type: useSpecial ? 'special' : 'normal',
            target: target
        };
    }

    canUseSpecial(character) {
        const costs = {
            Fighter: 20, Paladin: 40, Monk: 25, Berzerker: 0,
            Assassin: 20, Wizard: 25, Valkyrie: 35
        };
        
        const className = character.constructor.name;
        const cost = costs[className] || 0;
        return character.mana >= cost;
    }

    showStats() {
        let statsText = '📊 Current Statistics:\\n\\n';
        this.players.forEach(player => {
            const className = player.constructor.name;
            const status = player.isDead() ? '💀 Dead' : '✅ Alive';
            statsText += `${player.name} (${className}): ${player.hp}/${player.maxHp} HP, ${player.mana} mana [${status}]\\n`;
        });
        
        this.log(statsText);
    }

    endGame() {
        this.gamePhase = 'ended';
        this.currentPlayer = null;
        
        const alivePlayers = this.players.filter(p => !p.isDead());
        
        if (alivePlayers.length === 1) {
            const winner = alivePlayers[0];
            this.log(`🏆 ${winner.name} wins the battle!`);
        } else if (alivePlayers.length > 1) {
            // Multiple survivors - highest HP wins
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
            
            if (winners.length === 1) {
                this.log(`🏆 ${winners[0].name} wins with ${maxHp} HP!`);
            } else {
                this.log(`🤝 Draw! ${winners.map(w => w.name).join(', ')} win with ${maxHp} HP each!`);
            }
        } else {
            this.log(`💀 Everyone is dead! No winner.`);
        }
        
        this.updateDisplay();
        document.getElementById('actions').classList.add('hidden');
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    log(message) {
        const logContainer = document.getElementById('game-log');
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.innerHTML = message.replace(/\\n/g, '<br>');
        
        // Add appropriate classes for styling
        if (message.includes('🤖')) entry.classList.add('ai');
        if (message.includes('🎮')) entry.classList.add('player');
        if (message.includes('attaque') || message.includes('damage')) entry.classList.add('damage');
        if (message.includes('soigne') || message.includes('heal')) entry.classList.add('heal');
        
        logContainer.appendChild(entry);
        logContainer.scrollTop = logContainer.scrollHeight;
    }
}