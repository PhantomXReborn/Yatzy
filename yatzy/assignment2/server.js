/**
 * Yatzy Game state machine (server-side).
 * One instance per active session — created by the route handler.
 *
 * CST3106 — Assignment #2
 */
const Dice = require("./Lab-7/js-lab7/dice");
const Engine = require("./Lab-7/js-lab7/yatzyEngine");

const MAX_ROLLS_PER_TURN = 3;
const DICE_COUNT = 5;

/**
 * Create a brand-new game state object.
 */
function createGame(playerNames = ["Player 1"]) {
  const players = playerNames.map((name, index) => ({
    index,
    name,
    scoreTable: {},
  }));

  const state = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    players,
    currentPlayerIndex: 0,
    rollsThisTurn: 0,
    heldDice: new Array(DICE_COUNT).fill(false),
    diceValues: [],
    running: true,
    finished: false,
    winner: null,
  };

  // Initial roll
  state.diceValues = Dice.roll();
  return state;
}

/**
 * Build a safe snapshot for the client.
 */
function snapshot(state) {
  const current = state.players[state.currentPlayerIndex];
  const scoreTable = current ? current.scoreTable : {};
  const diceValues = state.diceValues;

  const potentialScores = {};
  if (state.rollsThisTurn > 0) {
    Engine.CATEGORIES.forEach((cat) => {
      if (scoreTable[cat] == null) {
        potentialScores[cat] = Engine.calculateScore(cat, diceValues);
      }
    });
  }

  return {
    id: state.id,
    players: state.players.map((p) => ({
      index: p.index,
      name: p.name,
      totalScore: Engine.getTotalScore(p.scoreTable),
      scoreTable: p.scoreTable,
    })),
    currentPlayerIndex: state.currentPlayerIndex,
    currentPlayer: current ? current.name : null,
    rollsThisTurn: state.rollsThisTurn,
    heldDice: [...state.heldDice],
    diceValues: [...diceValues],
    potentialScores,
    running: state.running,
    finished: state.finished,
    winner: state.winner,
    canRoll: state.running && state.rollsThisTurn < MAX_ROLLS_PER_TURN,
    canScore: state.running && state.rollsThisTurn > 0,
    maxRolls: MAX_ROLLS_PER_TURN,
  };
}

/**
 * Roll non-held dice, incrementing the roll counter.
 */
function rollDice(state) {
  if (!state.running) return { error: "Game is not running." };
  if (state.rollsThisTurn >= MAX_ROLLS_PER_TURN) {
    return { error: "No rolls remaining this turn." };
  }

  if (state.rollsThisTurn === 0) {
    // First roll of the turn: roll all
    state.diceValues = Dice.roll();
  } else {
    // Subsequent rolls: only roll non-held dice
    const newFaces = Dice.roll(); // Get 5 random faces
    for (let i = 0; i < DICE_COUNT; i++) {
      if (!state.heldDice[i]) {
        state.diceValues[i] = newFaces[i]; // Keep held, replace unheld
      }
    }
  }

  state.rollsThisTurn++;
  return { ok: true };
}

/**
 * Toggle hold state for a die index.
 */
function toggleHold(state, index) {
  if (!state.running) return { error: "Game is not running." };
  if (state.rollsThisTurn === 0) {
    return { error: "Roll at least once before holding dice." };
  }
  if (!Number.isInteger(index) || index < 0 || index >= DICE_COUNT) {
    return { error: "Invalid die index." };
  }
  state.heldDice[index] = !state.heldDice[index];
  return { ok: true };
}

/**
 * Record a category score for the current player, then advance the turn.
 */
function scoreTurn(state, category) {
  if (!state.running) return { error: "Game is not running." };
  if (state.rollsThisTurn === 0) {
    return { error: "Roll at least once before scoring." };
  }
  if (!Engine.CATEGORIES.includes(category)) {
    return { error: "Unknown category." };
  }

  const current = state.players[state.currentPlayerIndex];
  if (current.scoreTable[category] != null) {
    return { error: "Category already scored." };
  }

  const score = Engine.calculateScore(category, state.diceValues);
  current.scoreTable[category] = score;

  const allDone = state.players.every((p) =>
    Engine.isScorecardComplete(p.scoreTable)
  );

  if (allDone) {
    state.running = false;
    state.finished = true;

    const totals = state.players.map((p) => ({
      name: p.name,
      score: Engine.getTotalScore(p.scoreTable),
    }));
    const max = Math.max(...totals.map((t) => t.score));
    const winners = totals.filter((t) => t.score === max);
    state.winner =
      winners.length === 1 ? winners[0].name : winners.map((w) => w.name);
  } else {
    state.currentPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
    state.rollsThisTurn = 0;
    state.heldDice = new Array(DICE_COUNT).fill(false);
    state.diceValues = Dice.roll();
  }

  return { ok: true, score };
}

module.exports = {
  createGame,
  snapshot,
  rollDice,
  toggleHold,
  scoreTurn,
};