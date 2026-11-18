/**
 * Yatzy Engine Module
 * Handles the rules and score calculation of the Yatzy game.
 * STATELESS — pure functions usable on the server.
 *
 * Lab 06 / Assignment 2 — CST3106
 */

const CATEGORIES = [
  "ones", "twos", "threes", "fours", "fives", "sixes",
  "threeOfAKind", "fourOfAKind", "fullHouse",
  "smallStraight", "largeStraight", "yatzy", "chance",
];

const UPPER_CATEGORIES = ["ones", "twos", "threes", "fours", "fives", "sixes"];
const UPPER_BONUS_THRESHOLD = 63;
const UPPER_BONUS_POINTS = 35;

// ----- Private helpers -----
function countFaces(diceValues) {
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  diceValues.forEach((v) => counts[v]++);
  return counts;
}

function sum(diceValues) {
  return diceValues.reduce((a, b) => a + b, 0);
}

function isStraight(diceValues, length) {
  const unique = [...new Set(diceValues)].sort((a, b) => a - b);
  for (let i = 0; i <= unique.length - length; i++) {
    let consecutive = true;
    for (let j = 0; j < length - 1; j++) {
      if (unique[i + j + 1] !== unique[i + j] + 1) {
        consecutive = false;
        break;
      }
    }
    if (consecutive) return true;
  }
  return false;
}

// ----- Public API -----

/**
 * Calculates the score for a given category based on dice values.
 */
function calculateScore(category, diceValues) {
  const counts = countFaces(diceValues);
  const total = sum(diceValues);
  const values = Object.values(counts).sort((a, b) => b - a);

  switch (category) {
    case "ones":   return counts[1] * 1;
    case "twos":   return counts[2] * 2;
    case "threes": return counts[3] * 3;
    case "fours":  return counts[4] * 4;
    case "fives":  return counts[5] * 5;
    case "sixes":  return counts[6] * 6;
    case "threeOfAKind":  return values[0] >= 3 ? total : 0;
    case "fourOfAKind":   return values[0] >= 4 ? total : 0;
    case "fullHouse":     return values[0] === 3 && values[1] === 2 ? 25 : 0;
    case "smallStraight": return isStraight(diceValues, 4) ? 30 : 0;
    case "largeStraight": return isStraight(diceValues, 5) ? 40 : 0;
    case "yatzy":         return values[0] === 5 ? 50 : 0;
    case "chance":        return total;
    default: return 0;
  }
}

/**
 * Returns the total score for a player's scoreTable, including upper bonus.
 */
function getTotalScore(scoreTable = {}) {
  let total = 0;
  let upperTotal = 0;

  for (const cat of CATEGORIES) {
    const val = scoreTable[cat] || 0;
    total += val;
    if (UPPER_CATEGORIES.includes(cat)) upperTotal += val;
  }

  if (upperTotal >= UPPER_BONUS_THRESHOLD) total += UPPER_BONUS_POINTS;
  return total;
}

/**
 * Returns true if all categories are filled for a player.
 */
function isScorecardComplete(scoreTable = {}) {
  return CATEGORIES.every((cat) => scoreTable[cat] != null);
}

module.exports = {
  CATEGORIES,
  UPPER_CATEGORIES,
  UPPER_BONUS_THRESHOLD,
  UPPER_BONUS_POINTS,
  calculateScore,
  getTotalScore,
  isScorecardComplete,
};