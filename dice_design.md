# 🎲 Dice Design — Yatzy Game

> **Course:** CST3106 — Lab 05
> **Author:** Reece Hannah
> **Project:** Yatzy Game
> **Last Updated:** 2026

---

## 1. Overview

Each die is a **60×60px rounded square** with a cream face, dark pips, and a gold border. Pips are positioned using **CSS Grid** so the same `.die` element can render any face (1–6) by toggling a `data-value` attribute.

---

## 2. Specifications

| Property | Value |
|----------|-------|
| Size | 60px × 60px (desktop), 50px (tablet), 40px (mobile) |
| Background | `--cream` (`#f5f0e1`) |
| Border | 2px solid `--gold` (`#d4a843`) |
| Border Radius | `--radius-lg` (16px) |
| Pips | 10px circles, `--stone` (`#2c2c2c`) |
| Shadow | `--shadow` + `--inner-shadow` |
| Hover | Scale 1.05, `--glow-gold` |
| Held | Gold border, gold glow, checkmark badge |
| Cursor | Pointer |

---

## 3. Pip Layouts (Faces 1–6)

Pips are placed on a 3×3 CSS Grid. The table below shows which grid cells contain a pip for each face.

| Face | Grid Positions (row / column) |
|------|-------------------------------|
| 1 | (2,2) |
| 2 | (1,1), (3,3) |
| 3 | (1,1), (2,2), (3,3) |
| 4 | (1,1), (1,3), (3,1), (3,3) |
| 5 | (1,1), (1,3), (2,2), (3,1), (3,3) |
| 6 | (1,1), (1,3), (2,1), (2,3), (3,1), (3,3) |

---

## 4. Visual Sketch (ASCII)

```
   ┌─────────┐   ┌─────────┐   ┌─────────┐
   │         │   │ ●       │   │ ●       │
   │    ●    │   │         │   │    ●    │
   │         │   │       ● │   │       ● │
   └─────────┘   └─────────┘   └─────────┘
        1             2             3

   ┌─────────┐   ┌─────────┐   ┌─────────┐
   │ ●     ● │   │ ●     ● │   │ ●     ● │
   │         │   │    ●    │   │ ●     ● │
   │ ●     ● │   │ ●     ● │   │ ●     ● │
   └─────────┘   └─────────┘   └─────────┘
        4             5             6
```

---

## 5. Digital Representation

### 5.1 HTML Structure

Each die is a single `.die` element containing one `<span class="pip">` per visible pip. The `data-value` attribute controls which pips are shown via CSS.

```html
<!-- Face 5 example -->
<div class="die" data-value="5">
  <span class="pip"></span>
  <span class="pip"></span>
  <span class="pip"></span>
  <span class="pip"></span>
  <span class="pip"></span>
</div>
```

### 5.2 CSS

```css
.die {
  width: 60px;
  height: 60px;
  background: var(--cream);
  border: 2px solid var(--gold);
  border-radius: var(--radius-lg);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  place-items: center;
  box-shadow: var(--shadow), var(--inner-shadow);
  transition: transform 0.2s var(--ease-bounce), box-shadow 0.2s;
  cursor: pointer;
}

.pip {
  width: 10px;
  height: 10px;
  background: var(--stone);
  border-radius: 50%;
}

/* Pip placement per face */
.die[data-value="1"] .pip:nth-child(1) { grid-area: 2 / 2; }

.die[data-value="2"] .pip:nth-child(1) { grid-area: 1 / 1; }
.die[data-value="2"] .pip:nth-child(2) { grid-area: 3 / 3; }

.die[data-value="3"] .pip:nth-child(1) { grid-area: 1 / 1; }
.die[data-value="3"] .pip:nth-child(2) { grid-area: 2 / 2; }
.die[data-value="3"] .pip:nth-child(3) { grid-area: 3 / 3; }

.die[data-value="4"] .pip:nth-child(1) { grid-area: 1 / 1; }
.die[data-value="4"] .pip:nth-child(2) { grid-area: 1 / 3; }
.die[data-value="4"] .pip:nth-child(3) { grid-area: 3 / 1; }
.die[data-value="4"] .pip:nth-child(4) { grid-area: 3 / 3; }

.die[data-value="5"] .pip:nth-child(1) { grid-area: 1 / 1; }
.die[data-value="5"] .pip:nth-child(2) { grid-area: 1 / 3; }
.die[data-value="5"] .pip:nth-child(3) { grid-area: 2 / 2; }
.die[data-value="5"] .pip:nth-child(4) { grid-area: 3 / 1; }
.die[data-value="5"] .pip:nth-child(5) { grid-area: 3 / 3; }

.die[data-value="6"] .pip:nth-child(1) { grid-area: 1 / 1; }
.die[data-value="6"] .pip:nth-child(2) { grid-area: 1 / 3; }
.die[data-value="6"] .pip:nth-child(3) { grid-area: 2 / 1; }
.die[data-value="6"] .pip:nth-child(4) { grid-area: 2 / 3; }
.die[data-value="6"] .pip:nth-child(5) { grid-area: 3 / 1; }
.die[data-value="6"] .pip:nth-child(6) { grid-area: 3 / 3; }

/* Interactive states */
.die:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow), var(--glow-gold);
}

.die.held {
  border-color: var(--gold-light);
  box-shadow: var(--shadow), var(--glow-gold);
}
```

---

## 6. Interactive States

| State | Trigger | Visual Change |
|-------|---------|---------------|
| Default | — | Cream face, stone pips, subtle shadow |
| Hover | Mouse over | Scale 1.05, gold glow |
| Held | Click | Gold-light border, gold glow, checkmark badge |
| Rolling | Roll button | Rotation + scale animation (0.5s) |
| Landing | After roll | Bounce easing (0.3s) |

---

## 7. References

- [W3Schools CSS Grid](https://www.w3schools.com/css/css_grid.asp)
- [W3Schools CSS Transitions](https://www.w3schools.com/css/css3_transitions.asp)
- [MDN CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)