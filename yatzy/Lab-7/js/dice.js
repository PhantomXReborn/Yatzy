/**
 * Dice Module (server-side)
 * Pure random generation — no DOM, no timers, no state.
 *
 * CST3106 — Assignment #2
 */

/**
 * Returns a random face value 1–6.
 * @returns {number}
 */
function randomFace() {
  return Math.floor(Math.random() * 6) + 1;
}

/**
 * Roll a set of dice.
 * @param {number} count             Number of dice to manage.
 * @param {number[]|null} indices    Indices to re-roll (null = roll all).
 * @param {number[]|null} current    Current dice values (needed if indices is set).
 * @returns {number[]}               New dice values.
 */
function roll(count, indices = null, current = null) {
  let values =
    current && current.length === count
      ? [...current]
      : new Array(count).fill(1);

  if (Array.isArray(indices) && indices.length > 0) {
    indices.forEach((i) => {
      if (i >= 0 && i < count) values[i] = randomFace();
    });
  } else {
    values = values.map(() => randomFace());
  }

  return values;
}

module.exports = { roll, randomFace };