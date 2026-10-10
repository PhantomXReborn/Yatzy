# Yatzy Game

A browser-based implementation of the classic dice game **Yatzy** (also known as Yahtzee). Players roll five dice up to three times per turn, aiming to score the highest total by matching specific combinations.

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
- JavaScript (planned for implementation)
