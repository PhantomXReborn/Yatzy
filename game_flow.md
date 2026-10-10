# 🎮 Game Flow & Interactions — Yatzy

> **Course:** CST3106 — Lab 05
> **Author:** [Your Name]
> **Project:** Yatzy Game
> **Last Updated:** 2026

---

## 1. Overview

This document explains the **layout, flow, interactions, animations, and design rationale** for the Yatzy game. It complements the design system (`design_system.md`) and dice design (`dice_design.md`) documents.

---

## 2. Layout & Flow

### 2.1 Game States

| State | Description |
|-------|-------------|
| Start Screen | Optional name entry / player selection |
| Game Screen | Main gameplay loop |
| End Screen | Final scores and winner |

### 2.2 Game Screen Flow

```
┌──────────────────────────────────────┐
│ 1. Header: current player, roll count│
├──────────────────────────────────────┤
│ 2. Player rolls dice (up to 3 times) │
│    - Click "Roll Dice"               │
│    - Optionally hold/re-roll dice    │
├──────────────────────────────────────┤
│ 3. Player selects a category         │
│    - Click scorecard row             │
│    - Score recorded                  │
├──────────────────────────────────────┤
│ 4. Turn passes to next player        │
├──────────────────────────────────────┤
│ 5. Repeat until all 13 categories    │
│    are filled for every player       │
├──────────────────────────────────────┤
│ 6. End Screen: winner announced      │
└──────────────────────────────────────┘
```

### 2.3 Turn Flow (Detailed)

1. **Roll 1** — All five dice roll. Player may hold any dice.
2. **Roll 2** — Only unheld dice roll. Player may change holds.
3. **Roll 3** — Only unheld dice roll. Player must now choose a category.
4. **Score Selection** — Player clicks a category on the scorecard.
5. **Turn End** — Score is locked in; active player switches.

---

## 3. User Interactions

| Interaction | Trigger | Response |
|-------------|---------|----------|
| Roll dice | Click "Roll Dice" | Dice animate; values update |
| Hold die | Click a die | Die gets gold border + checkmark |
| Release die | Click held die | Die returns to default state |
| Select category | Click scorecard row | Score recorded; row muted |
| End turn | After category selected | Turn passes; header updates |
| View rules | Click "Rules" link | Modal opens with rules |
| Restart game | Click "New Game" | Board resets to initial state |

---

## 4. Animations

| Animation | Duration | Easing | Description |
|-----------|----------|--------|-------------|
| Dice roll | 0.5s | `--ease-bounce` | Rotation + scale, blurred pips |
| Dice landing | 0.3s | `--ease-bounce` | Settles into final position |
| Score pop | 0.4s | `--ease-bounce` | Score number scales up briefly |
| Turn transition | 0.5s | `--ease-smooth` | Fade between players |
| Yatzy celebration | 2s | `--ease-smooth` | Confetti + gold glow pulse |
| Button hover | 0.2s | `--ease-smooth` | Lift -2px + gold glow |
| Card hover | 0.3s | `--ease-bounce` | Scale 1.02 + glow |

---

## 5. Design Rationale

### 5.1 Color Choices

- **Felt green (`#14523f`)** — Evokes classic casino/tabletop feel, warm and inviting.
- **Gold (`#d4a843`)** — Primary accent; draws attention to interactive elements.
- **Cream (`#f5f0e1`)** — High contrast against felt for dice and scorecards.
- **Red (`#c0392b`)** — Reserved for Yatzy (the highest-scoring category).
- **Blue (`#2980b9`)** — Reserved for Player 2 / info states.

### 5.2 Typography Choices

- **Montserrat** — Bold, modern, and confident; perfect for game title and headings.
- **Open Sans** — Highly readable body text for rules and descriptions.
- **Fira Code** — Monospace numerals ensure scores align perfectly in the scorecard.

### 5.3 Layout Choices

- **Two-column grid** — Dice tray and scorecard side-by-side on desktop for quick reference.
- **Stacked on mobile** — Collapses to one column below 1024px for touch-friendly play.
- **Rounded corners** — Softens the UI, makes it approachable rather than intimidating.
- **Frosted glass header/footer** — Modern, keeps focus on the game board.

### 5.4 Interaction Choices

- **Click to hold dice** — Simple, discoverable; gold glow confirms state.
- **Click scorecard row to score** — Direct manipulation; less error-prone than drag-and-drop.
- **Bounce easing** — Adds playful personality; fits the dice theme.

---

## 6. Accessibility Considerations

| Issue | Mitigation |
|-------|------------|
| Color-only player indication | Add player icons (👤 / 🎯) alongside colors |
| Dice values visually only | Add `aria-label="Die showing 5"` |
| Roll count changes | Use `aria-live="polite"` on the counter |
| Focus states | Add `:focus-visible` gold outline |
| Reduced motion | Respect `prefers-reduced-motion` media query |
| Keyboard navigation | All interactive elements reachable via Tab |

**Recommended CSS:**

```css
:focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: 2px;
  border-radius: 4px;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 7. References

- [W3Schools CSS Animations](https://www.w3schools.com/css/css3_animations.asp)
- [W3Schools CSS Transitions](https://www.w3schools.com/css/css3_transitions.asp)
- [MDN ARIA Live Regions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions)
- [MDN prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)