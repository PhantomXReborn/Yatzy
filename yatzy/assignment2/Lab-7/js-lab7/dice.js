/**
 * Dice Module
 * Encapsulates the logic for rolling dice.
 *
 * Lab 06 / Assignment 2 — CST3106
 */

const Dice = (() => {
  let diceCount = 5;

  /**
   * Returns a random integer between 1 and 6 (inclusive).
   */
  function randomFace() {
    return Math.floor(Math.random() * 6) + 1;
  }

  return {
    setDiceCount(count) {
      diceCount = count;
    },

    getDiceCount() {
      return diceCount;
    },

    /**
     * Rolls all dice (or only the indices provided).
     * @param {number[]} [indices=null] - optional indices to re-roll
     * @returns {number[]} the new dice values
     */
    roll(indices = null) {
      let newValues = new Array(diceCount).fill(1);

      if (Array.isArray(indices) && indices.length > 0) {
        // If indices provided, we need the current values to preserve held dice.
        // In the server, we handle the merging, so we just return an object here
        // OR we adjust how the server calls this. 
        // For simplicity in the server, let's return an array of random faces
        // and let the server merge them.
        indices.forEach((i) => {
          if (i >= 0 && i < diceCount) newValues[i] = randomFace();
        });
      } else {
        // Roll all
        newValues = newValues.map(() => randomFace());
      }

      return newValues;
    }
  };
})();

if (typeof module !== "undefined" && module.exports) {
  module.exports = Dice;
}