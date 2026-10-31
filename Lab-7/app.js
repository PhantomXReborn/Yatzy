/**
 * App Controller
 * Handles UI rendering, DOM manipulation, and event listeners.
 * Connects the HTML to the YatzyGame, YatzyEngine, and Dice modules.
 */
document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const diceContainer = document.getElementById('diceContainer');
  const rollBtn = document.getElementById('rollBtn');
  const rollCounter = document.getElementById('rollCounter');
  const scorecardBody = document.getElementById('scorecardBody');
  const totalScoreDisplay = document.getElementById('totalScoreDisplay');
  const player1Card = document.getElementById('player1Card');
  const player2Card = document.getElementById('player2Card');
  const player1Score = document.getElementById('player1Score');
  const player2Score = document.getElementById('player2Score');
  const statusText = document.getElementById('statusText');
  
  // Modal Elements
  const modal = document.getElementById('categoryModal');
  const modalText = document.getElementById('modalText');
  const confirmModalBtn = document.getElementById('confirmModalBtn');
  const cancelModalBtn = document.getElementById('cancelModalBtn');

  let selectedCategory = null;

  // Initialize Game
  YatzyGame.startNewGame();
  renderDice();
  renderScorecard();
  updatePlayerPanels();

  /**
   * Renders the 5 dice based on current values and held state.
   */
  function renderDice() {
    const state = YatzyGame.getState();
    const values = Dice.getValues();
    const held = state.heldDice;

    diceContainer.innerHTML = '';

    values.forEach((val, index) => {
      const die = document.createElement('div');
      die.className = 'die';
      die.setAttribute('data-value', val);
      
      if (held[index]) die.classList.add('held');

      // Create pips
      for (let i = 0; i < val; i++) {
        const pip = document.createElement('span');
        pip.className = 'pip';
        die.appendChild(pip);
      }

      // Click to hold/release
      die.addEventListener('click', () => {
        YatzyGame.toggleHold(index);
        renderDice(); // re-render to show updated held state
      });

      diceContainer.appendChild(die);
    });

    // Update UI text/buttons
    const rollsLeft = 3 - state.rollsThisTurn;
    rollCounter.textContent = state.rollsThisTurn === 0 ? "Ready to Roll" : `Roll ${state.rollsThisTurn} of 3`;
    rollBtn.disabled = state.rollsThisTurn >= 3 || !state.running;
    
    // Update Scorecard preview if they have rolled
    if (state.rollsThisTurn > 0) {
      renderScorecard();
    }
  }

  /**
   * Renders the scorecard based on the current state and dice values.
   */
  function renderScorecard() {
    const state = YatzyGame.getState();
    const currentValues = Dice.getValues();
    const playerIndex = state.currentPlayerIndex;
    const scoreTable = YatzyEngine.getScoreTable(playerIndex);

    scorecardBody.innerHTML = '';

    YatzyEngine.CATEGORIES.forEach(cat => {
      const tr = document.createElement('tr');
      const isScored = scoreTable[cat] != null;
      
      // Calculate potential score for this roll
      const potentialScore = YatzyEngine.calculateScore(cat, currentValues);

      tr.innerHTML = `
        <td>${formatCategoryName(cat)}</td>
        <td>${isScored ? scoreTable[cat] : (state.rollsThisTurn > 0 ? potentialScore : '—')}</td>
      `;

      // Add specific row classes
      if (cat === 'yatzy') tr.classList.add('yatzy');
      if (cat === 'fullHouse' || cat === 'smallStraight' || cat === 'largeStraight') {
         // Just for visual separation in future if needed
      }

      if (isScored) {
        tr.style.opacity = '0.5';
      } else if (state.rollsThisTurn > 0 && state.running) {
        tr.classList.add('active');
        tr.addEventListener('click', () => openScoreModal(cat, potentialScore));
      }

      scorecardBody.appendChild(tr);
      
      // Insert Subtotal and Bonus after Sixes
      if (cat === 'sixes') {
        addSubtotalRows(scoreTable);
      }
    });

    // Calculate current total
    const currentTotal = YatzyEngine.getTotalScore(playerIndex);
    totalScoreDisplay.textContent = currentTotal;
  }

  /**
   * Adds the subtotal and bonus rows after the upper section.
   */
  function addSubtotalRows(scoreTable) {
    const upperCats = ['ones','twos','threes','fours','fives','sixes'];
    let upperTotal = 0;
    upperCats.forEach(c => upperTotal += (scoreTable[c] || 0));
    
    const subTr = document.createElement('tr');
    subTr.className = 'subtotal';
    subTr.innerHTML = `<td>Upper Subtotal</td><td>${upperTotal}</td>`;
    scorecardBody.appendChild(subTr);

    const bonusTr = document.createElement('tr');
    bonusTr.className = 'bonus';
    const bonusVal = upperTotal >= 63 ? 35 : '—';
    bonusTr.innerHTML = `<td>Upper Bonus (63+)</td><td>${bonusVal}</td>`;
    scorecardBody.appendChild(bonusTr);
  }

  /**
   * Formats camelCase keys to Title Case.
   */
  function formatCategoryName(str) {
    return str
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, s => s.toUpperCase());
  }

  /**
   * Updates the player cards (scores and active glow).
   */
  function updatePlayerPanels() {
    const state = YatzyGame.getState();
    
    // Update scores
    player1Score.textContent = state.players[0].totalScore;
    player2Score.textContent = state.players[1].totalScore;

    // Toggle active classes
    if (state.currentPlayerIndex === 0) {
      player1Card.classList.add('active');
      player2Card.classList.remove('active');
    } else {
      player2Card.classList.add('active');
      player1Card.classList.remove('active');
    }

    // Update footer status
    statusText.textContent = `🏆 High Score: 245 · 👤 ${state.currentPlayer.name}'s turn`;
  }

  /**
   * Opens the confirmation modal.
   */
  function openScoreModal(category, score) {
    selectedCategory = category;
    modalText.innerHTML = `Record your score for <strong>${formatCategoryName(category)}</strong>?<br><br>Points: <strong>${score}</strong>`;
    modal.classList.add('open');
  }

  // --- Event Listeners ---

  rollBtn.addEventListener('click', () => {
    const state = YatzyGame.getState();
    if (state.rollsThisTurn >= 3) return;

    // Add visual roll animation
    const dice = diceContainer.querySelectorAll('.die');
    dice.forEach(d => {
      if (!d.classList.contains('held')) d.classList.add('rolling');
    });

    // Perform the roll in the logic
    YatzyGame.rollDice();
    
    // Update UI after a short animation delay
    setTimeout(() => {
      renderDice();
    }, 300);
  });

  confirmModalBtn.addEventListener('click', () => {
    if (!selectedCategory) return;

    const result = YatzyGame.scoreTurn(selectedCategory);
    
    if (result.success) {
      modal.classList.remove('open');
      selectedCategory = null;
      
      const state = YatzyGame.getState();
      
      if (!state.running) {
        handleGameOver();
      } else {
        renderDice();
        renderScorecard();
        updatePlayerPanels();
      }
    } else {
      alert(result.message); // Handle invalid selection (shouldn't happen with UI checks)
    }
  });

  cancelModalBtn.addEventListener('click', () => {
    modal.classList.remove('open');
    selectedCategory = null;
  });

  function handleGameOver() {
    const finalResult = YatzyGame.endGame();
    
    let message = "Game Over!\n\n";
    finalResult.finalScores.forEach(p => {
      message += `${p.name}: ${p.score}\n`;
    });
    
    if (finalResult.tie) {
      message += `\nIt's a tie!`;
    } else {
      message += `\nWinner: ${finalResult.winner}! 🏆`;
    }
    
    alert(message);
    
    // Optional: Reset game after alert
    // YatzyGame.startNewGame();
    // renderDice();
    // renderScorecard();
    // updatePlayerPanels();
  }
});