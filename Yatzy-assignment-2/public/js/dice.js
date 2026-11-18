/**
 * Dice Module
 * Encapsulates the logic for rolling dice.
 * Shared between the server (authoritative) and client (harmless).
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
     * Rolls `diceCount` dice and returns the full array of faces.
     * The server merges held dice itself, so this always returns
     * a complete new array of random faces.
     *
     * @returns {number[]} the new dice values
     */
    roll() {
      return Array.from({ length: diceCount }, randomFace);
    },
  };
})();

if (typeof module !== "undefined" && module.exports) {
  module.exports = Dice;
}