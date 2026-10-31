document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const diceContainer = document.getElementById('diceContainer');
  const rollBtn = document.getElementById('rollBtn');
  const endTurnBtn = document.getElementById('endTurnBtn');
  const rollCounter = document.getElementById('rollCounter');
  const scorecardBody = document.getElementById('scorecardBody');
  const totalScoreDisplay = document.getElementById('totalScoreDisplay');
  const player1Score = document.getElementById('player1Score');
  const statusText = document.getElementById('statusText');
  
  // Modal Elements
  const modal = document.getElementById('categoryModal');
  const modalContent = document.getElementById('modalContent');

  let selectedCategory = null;

  // Initialize Game (Single Player)
  YatzyGame.startNewGame(["Player 1"]);
  renderDice();
  renderScorecard();
  updatePlayerPanel();

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
        if (state.rollsThisTurn === 0) return; // Can't hold before rolling
        YatzyGame.toggleHold(index);
        renderDice(); 
      });

      diceContainer.appendChild(die);
    });

    // Update UI text/buttons
    rollCounter.textContent = state.rollsThisTurn === 0 ? "Ready to Roll" : `Roll ${state.rollsThisTurn} of 3`;
    
    // Disable roll button if no rolls left
    rollBtn.disabled = state.rollsThisTurn >= 3 || !state.running;
    
    // Show End Turn button if they have rolled at least once
    if (state.rollsThisTurn > 0) {
      endTurnBtn.style.display = 'block';
      endTurnBtn.textContent = state.rollsThisTurn >= 3 ? "Pick a Score (0)" : "End Turn Early";
    } else {
      endTurnBtn.style.display = 'none';
    }
    
    if (state.rollsThisTurn > 0) {
      renderScorecard();
    }
  }

  function renderScorecard() {
    const state = YatzyGame.getState();
    const currentValues = Dice.getValues();
    const playerIndex = state.currentPlayerIndex;
    const scoreTable = YatzyEngine.getScoreTable(playerIndex);

    scorecardBody.innerHTML = '';

    YatzyEngine.CATEGORIES.forEach(cat => {
      const tr = document.createElement('tr');
      const isScored = scoreTable[cat] != null;
      
      const potentialScore = YatzyEngine.calculateScore(cat, currentValues);

      tr.innerHTML = `
        <td>${formatCategoryName(cat)}</td>
        <td>${isScored ? scoreTable[cat] : (state.rollsThisTurn > 0 ? potentialScore : '—')}</td>
      `;

      if (cat === 'yatzy') tr.classList.add('yatzy');

      if (isScored) {
        tr.style.opacity = '0.5';
      } else if (state.rollsThisTurn > 0 && state.running) {
        tr.classList.add('active');
        tr.addEventListener('click', () => openScoreModal(cat, potentialScore));
      }

      scorecardBody.appendChild(tr);
      
      if (cat === 'sixes') addSubtotalRows(scoreTable);
    });

    totalScoreDisplay.textContent = YatzyEngine.getTotalScore(playerIndex);
  }

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

  function formatCategoryName(str) {
    return str.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
  }

  function updatePlayerPanel() {
    const state = YatzyGame.getState();
    player1Score.textContent = state.players[0].totalScore;
    statusText.textContent = `🏆 High Score: 245 · 👤 ${state.currentPlayer.name}'s turn`;
  }

  function openScoreModal(category, score) {
    selectedCategory = category;
    modalContent.innerHTML = `
      <h3>Confirm Score</h3>
      <p>Record your score for <strong>${formatCategoryName(category)}</strong>?<br><br>Points: <strong>${score}</strong></p>
      <div class="modal-actions">
        <button class="modal-btn cancel" id="cancelModalBtn">Cancel</button>
        <button class="modal-btn confirm" id="confirmModalBtn">Confirm</button>
      </div>
    `;
    modal.classList.add('open');

    document.getElementById('cancelModalBtn').addEventListener('click', () => {
      modal.classList.remove('open');
      selectedCategory = null;
    });

    document.getElementById('confirmModalBtn').addEventListener('click', () => {
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
          updatePlayerPanel();
        }
      }
    });
  }

  // End Turn Button Logic (Assigns 0 points to a random empty category if they give up)
  endTurnBtn.addEventListener('click', () => {
    const state = YatzyGame.getState();
    const scoreTable = YatzyEngine.getScoreTable(state.currentPlayerIndex);
    
    // Find the first available category to assign a 0
    const emptyCat = YatzyEngine.CATEGORIES.find(c => scoreTable[c] == null);
    
    if (emptyCat) {
      YatzyGame.scoreTurn(emptyCat);
      renderDice();
      renderScorecard();
      updatePlayerPanel();
    }
  });

  rollBtn.addEventListener('click', () => {
    const state = YatzyGame.getState();
    if (state.rollsThisTurn >= 3) return;

    const dice = diceContainer.querySelectorAll('.die');
    dice.forEach(d => {
      if (!d.classList.contains('held')) d.classList.add('rolling');
    });

    YatzyGame.rollDice();
    
    setTimeout(() => {
      renderDice();
    }, 300);
  });

  function handleGameOver() {
    const finalResult = YatzyGame.endGame();
    const finalScore = finalResult.finalScores[0].score;
    
    const message = finalScore >= 200 
      ? "Congratulations! You are a Yatzy master! 🏆" 
      : "Good try! Better luck next time. 🎲";
      
    modalContent.innerHTML = `
      <h3>Game Over!</h3>
      <p style="font-size: 1.2rem; margin: 1rem 0;">Final Score: <strong>${finalScore}</strong></p>
      <p>${message}</p>
      <div class="modal-actions" style="justify-content: center; margin-top: 1.5rem;">
        <button class="modal-btn confirm" onclick="location.reload()">Play Again</button>
      </div>
    `;
    modal.classList.add('open');
  }
});