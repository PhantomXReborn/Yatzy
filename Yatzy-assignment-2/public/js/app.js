/**
 * Yatzy — Client controller (Assignment #2)
 * Talks to the Express server via Fetch. Contains NO game rules.
 *
 * CST3106 — Assignment #2
 */
document.addEventListener("DOMContentLoaded", () => {
  const API = "/api/game";
  const $ = (id) => document.getElementById(id);

  const el = {
    diceContainer: $("diceContainer"),
    rollBtn:       $("rollBtn"),
    rollCounter:   $("rollCounter"),
    scorecardBody: $("scorecardBody"),
    totalScore:    $("totalScoreDisplay"),
    playerPanel:   $("playerPanel"),
    statusText:    $("statusText"),
    modal:         $("categoryModal"),
    modalContent:  $("modalContent"),
  };

  let gameId = null;
  let state  = null;

  /* ---------------- Fetch helpers ---------------- */
  async function api(path, options = {}) {
    const res = await fetch(path, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Request failed: ${res.status}`);
    }
    return res.status === 204 ? null : res.json();
  }

  async function createGame() {
    state = await api(API, {
      method: "POST",
      body: JSON.stringify({ players: ["Player 1"] }),
    });
    gameId = state.id;
    render();
  }

  async function doRoll() {
    // 1. Add animation class to all un-held dice
    const diceElements = document.querySelectorAll('.die');
    diceElements.forEach((die, i) => {
      if (!state.heldDice[i]) {
        die.classList.add('rolling');
      }
    });

    try {
      // 2. Wait for the animation to finish (400ms) before fetching
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // 3. Get the new state from the server
      state = await api(`${API}/${gameId}/roll`, { method: "POST" });
      
      // 4. Re-render (this replaces the DOM, clearing the animation class)
      render();
    } catch (err) {
      render(); // Reset UI if there was an error
      throw err;
    }
  }

  async function toggleHold(index) {
    state = await api(`${API}/${gameId}/hold`, {
      method: "PUT",
      body: JSON.stringify({ index }),
    });
    render();
  }

  async function scoreCategory(category) {
    state = await api(`${API}/${gameId}/score`, {
      method: "POST",
      body: JSON.stringify({ category }),
    });
    closeModal();
    render();
    if (state.finished) showGameOver();
  }

  /* ---------------- Rendering ---------------- */
  function render() {
    if (!state) return;
    renderDice();
    renderScorecard();
    renderPlayerPanel();
    renderFooter();
  }

  function renderDice() {
    el.diceContainer.innerHTML = "";

    state.diceValues.forEach((val, i) => {
      const die = document.createElement("div");
      die.className = "die";
      die.dataset.value = val;
      die.setAttribute("aria-label", `Die showing ${val}`);
      if (state.heldDice[i]) die.classList.add("held");

      for (let p = 0; p < val; p++) {
        const pip = document.createElement("span");
        pip.className = "pip";
        die.appendChild(pip);
      }

      if (state.canRoll || state.canScore) {
        die.addEventListener("click", () => {
          if (state.rollsThisTurn === 0) return;
          toggleHold(i).catch(showError);
        });
      }

      el.diceContainer.appendChild(die);
    });

    el.rollCounter.textContent =
      state.rollsThisTurn === 0
        ? "Ready to Roll"
        : `Roll ${state.rollsThisTurn} of ${state.maxRolls}`;

    el.rollBtn.disabled = !state.canRoll;
    el.rollBtn.textContent =
      state.rollsThisTurn >= state.maxRolls ? "No Rolls Left" : "Roll Dice";
  }

  function renderScorecard() {
    el.scorecardBody.innerHTML = "";

    const player = state.players[state.currentPlayerIndex];
    const table = player.scoreTable;
    const order = [
      "ones","twos","threes","fours","fives","sixes",
      "threeOfAKind","fourOfAKind","fullHouse",
      "smallStraight","largeStraight","yatzy","chance",
    ];

    order.forEach((cat) => {
      const tr = document.createElement("tr");
      const scored = table[cat] != null;
      const potential = state.potentialScores?.[cat];

      tr.innerHTML = `
        <td>${formatName(cat)}</td>
        <td>${scored ? table[cat] : (potential != null ? potential : "—")}</td>
      `;
      if (cat === "yatzy") tr.classList.add("yatzy");

      if (scored) {
        tr.style.opacity = "0.5";
      } else if (state.canScore) {
        tr.classList.add("active");
        tr.addEventListener("click", () =>
          openConfirmModal(cat, potential ?? 0)
        );
      }

      el.scorecardBody.appendChild(tr);

      if (cat === "sixes") addSubtotalRows(table);
    });

    el.totalScore.textContent = player.totalScore;
  }

  function addSubtotalRows(table) {
    const upper = ["ones","twos","threes","fours","fives","sixes"];
    const upperTotal = upper.reduce((a, c) => a + (table[c] || 0), 0);

    const sub = document.createElement("tr");
    sub.className = "subtotal";
    sub.innerHTML = `<td>Upper Subtotal</td><td>${upperTotal}</td>`;
    el.scorecardBody.appendChild(sub);

    const bonus = document.createElement("tr");
    bonus.className = "bonus";
    bonus.innerHTML = `<td>Upper Bonus (63+)</td><td>${
      upperTotal >= 63 ? 35 : "—"
    }</td>`;
    el.scorecardBody.appendChild(bonus);
  }

  function renderPlayerPanel() {
    el.playerPanel.innerHTML = "";
    state.players.forEach((p) => {
      const card = document.createElement("div");
      card.className = `player-card p${p.index + 1}` +
        (p.index === state.currentPlayerIndex ? " active" : "");
      card.innerHTML = `
        <span class="player-name">👤 ${p.name}</span>
        <span class="player-score">${p.totalScore}</span>`;
      el.playerPanel.appendChild(card);
    });
  }

  function renderFooter() {
    // Get high score from browser storage, default to 0
    let highScore = parseInt(localStorage.getItem("yatzyHighScore") || "0");

    if (state.finished) {
      const winner = Array.isArray(state.winner) ? state.winner.join(" & ") : state.winner;
      const winningScore = Math.max(...state.players.map(p => p.totalScore));
      
      // If the game just finished and we beat the high score, save it
      if (winningScore > highScore) {
        highScore = winningScore;
        localStorage.setItem("yatzyHighScore", highScore);
      }
      
      el.statusText.textContent = `🏆 Winner: ${winner} · High Score: ${highScore}`;
    } else {
      el.statusText.textContent =
        `🏆 High Score: ${highScore} · 👤 ${state.currentPlayer}'s turn · Roll ${state.rollsThisTurn}/${state.maxRolls}`;
    }
  }

  /* ---------------- Modal ---------------- */
  function openConfirmModal(category, score) {
    el.modalContent.innerHTML = `
      <h3>Confirm Score</h3>
      <p>Record <strong>${score}</strong> for
         <strong>${formatName(category)}</strong>?</p>
      <div style="display:flex;gap:.75rem;justify-content:flex-end;margin-top:1rem;">
        <button class="modal-btn cancel" id="cancelBtn">Cancel</button>
        <button class="modal-btn confirm" id="confirmBtn">Confirm</button>
      </div>`;
    el.modal.classList.add("open");

    $("cancelBtn").onclick  = closeModal;
    $("confirmBtn").onclick = () =>
      scoreCategory(category).catch(showError);
  }

  function closeModal() {
    el.modal.classList.remove("open");
    el.modalContent.innerHTML = "";
  }

  function showGameOver() {
    const winner = Array.isArray(state.winner)
      ? state.winner.join(" & ")
      : state.winner;
    el.modalContent.innerHTML = `
      <h3>Game Over!</h3>
      <p><strong>Winner: ${winner}</strong></p>
      <p>Final scores:</p>
      <ul style="margin: .5rem 0 1rem 1rem;">
        ${state.players.map((p) =>
          `<li>${p.name}: <strong>${p.totalScore}</strong></li>`
        ).join("")}
      </ul>
      <div style="display:flex;justify-content:center;">
        <button class="modal-btn confirm" id="newGameBtn">Play Again</button>
      </div>`;
    el.modal.classList.add("open");
    $("newGameBtn").onclick = () => {
      closeModal();
      createGame().catch(showError);
    };
  }

  /* ---------------- Utils ---------------- */
  function formatName(str) {
    return str.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
  }

  function showError(err) {
    alert(err.message || "Something went wrong.");
    console.error(err);
  }

  /* ---------------- Boot ---------------- */
  el.rollBtn.addEventListener("click", () => doRoll().catch(showError));
  createGame().catch(showError);
});