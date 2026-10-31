# Yatzy Game

A browser-based implementation of the classic dice game **Yatzy** (also known as Yahtzee). Players roll five dice up to three times per turn, aiming to score the highest total by matching specific combinations. The game features a classic casino/tabletop aesthetic with modern digital UI elements, animations, and responsive design.

## Rules

1. Each player takes turns rolling five six-sided dice.
2. On a turn, you may roll the dice up to **three times**. After each roll, you may set aside any dice you want to keep and re-roll the rest.
3. After your final roll, you must choose a **category** on the scorecard to record your score. Each category can be used only once per game.
4. **Upper section** (Ones, Twos, Threes, Fours, Fives, Sixes): Score the sum of dice showing that number.
5. **Lower section**:
   - **Three of a Kind**: Sum of all dice if at least three show the same number.
   - **Four of a Kind**: Sum of all dice if at least four show the same number.
   - **Full House**: 25 points for three of one number and two of another.
   - **Small Straight**: 30 points for four consecutive numbers (1-2-3-4, 2-3-4-5, or 3-4-5-6).
   - **Large Straight**: 40 points for five consecutive numbers (1-2-3-4-5 or 2-3-4-5-6).
   - **Yatzy**: 50 points for five of a kind.
   - **Chance**: Sum of all five dice.
6. **Bonus**: If the upper section total is 63 or more, add 35 bonus points.
7. The player with the highest total score at the end wins.

## Tech Stack

- HTML5
- CSS3
- JavaScript

---

## Lab 07 — UI Integration & Controller

Lab 07 focused on bridging the gap between the backend logic modules (created in Lab 06) and the user interface (designed in Lab 05). A fourth module, `app.js`, was introduced to act as the UI Controller. It handles event listeners, DOM manipulation, and rendering state based on the underlying data modules.

### Design Decisions

- **5 dice**, 6-sided — classic Yatzy.
- **13 scoring categories** (6 upper + 7 lower).
- **3 rolls per turn**, with hold/re-roll support.
- **2 players** by default (configurable).
- **63+ upper bonus = 35 points** — standard rule.
- **Separation of Concerns** — The UI (`app.js`) is completely decoupled from the game rules (`yatzyEngine.js`) and state (`yatzyGame.js`).

### Project Architecture

The project is divided into four distinct modules to ensure clean, maintainable code:

| Module | File | Responsibility |
|--------|------|----------------|
| **UI Controller** | `app.js` | DOM manipulation, event handling, rendering the UI |
| **Game State** | `yatzyGame.js` | Game flow, turns, rounds, player tracking |
| **Scoring Engine** | `yatzyEngine.js` | Rules, score calculation, validation, score table |
| **Dice** | `dice.js` | Random number generation, tracking held dice |

### Module API Overview

#### `dice.js`

| Method | Description |
|--------|-------------|
| `setDiceCount(count)` | Sets the number of dice managed |
| `getDiceCount()` | Returns the current dice count |
| `roll(indices?)` | Rolls all dice, or only the given indices |
| `getValues()` | Returns a copy of the current dice values |
| `getValue(index)` | Returns a single die value |

#### `yatzyEngine.js`

| Method | Description |
|--------|-------------|
| `calculateScore(category, diceValues)` | Returns the score for a category |
| `isValidSelection(category, diceValues, playerIndex?)` | Validates a category pick |
| `recordScore(playerIndex, category, score)` | Records a score in the table |
| `getTotalScore(playerIndex)` | Total score incl. upper bonus |
| `getScoreTable(playerIndex)` | Returns the player's score table |
| `isScorecardComplete(playerIndex)` | True when all 13 categories are filled |
| `resetScoreTable()` | Clears the score table |

#### `yatzyGame.js`

| Method | Description |
|--------|-------------|
| `startNewGame(playerNames?)` | Initializes a new game |
| `getState()` | Returns a snapshot of the game state |
| `rollDice()` | Rolls non-held dice (max 3 per turn) |
| `toggleHold(index)` | Toggles the hold state of a die |
| `scoreTurn(category)` | Records a score and ends the turn |
| `endTurn()` | Switches to the next player |
| `endGame()` | Determines the winner and finalizes |

#### `app.js` (New in Lab 07)

| Function | Description |
|----------|-------------|
| `renderDice()` | Creates DOM elements for the dice and updates their pips based on `Dice.getValues()` |
| `renderScorecard()` | Updates the scorecard table with current potential scores and greys out used categories |
| `updatePlayerPanels()` | Toggles the active player glow and updates total scores |
| `handleGameOver()` | Triggers the final winner alert when all categories are filled |
| `openScoreModal(category, score)` | Opens the confirmation modal for scoring |

### Usage

To run the game, no build tools are required. Simply open `index.html` in a browser. The HTML must load the modules in the correct order (logic first, UI controller last):

```html
<!-- Load Logic Modules First -->
<script src="js/dice.js"></script>
<script src="js/yatzyEngine.js"></script>
<script src="js/yatzyGame.js"></script>

<!-- Load UI Controller Last -->
<script src="js/app.js"></script>