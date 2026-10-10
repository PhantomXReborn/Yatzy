# 🎨 Design System — Yatzy Game

> **Course:** CST3106 — Lab 05
> **Author:** Reece Hannah
> **Project:** Yatzy Game (Classic Dice Game)
> **Last Updated:** 2026

---

## 1. Overview

The Yatzy Game is a browser-based implementation of the classic dice game, built with **vanilla HTML, CSS, and JavaScript**. The visual identity fuses two themes:

- 🎲 **Classic Casino / Tabletop** — felt green surfaces, warm wood accents, gold trim
- ⚡ **Modern Digital** — clean flat design, subtle shadows, smooth animations

This document defines the **design tokens, typography, components, layouts, and responsive behavior** used throughout the project.

---

## 2. Color Palette

All colors are stored as CSS custom properties (variables) in `:root` inside the inline `<style>` block of `mockup.html`.

### 2.1 Core Backgrounds (Table Layer)

| Token | Hex | Usage |
|-------|-----|-------|
| `--felt-dark` | `#0d3b2e` | Deepest background (body) |
| `--felt` | `#14523f` | Main game table surface |
| `--felt-light` | `#1a6b52` | Lighter panels, hover states |
| `--felt-highlight` | `#2d8a6e` | Accent surfaces, active areas |

### 2.2 Primary Accents

| Token | Hex | Usage |
|-------|-----|-------|
| `--gold` | `#d4a843` | Primary accent, buttons, borders |
| `--gold-light` | `#e8c76a` | Hover states, highlights |
| `--gold-dark` | `#b08a2e` | Pressed states, depth |
| `--cream` | `#f5f0e1` | Dice background, cards |

### 2.3 Secondary Accents

| Token | Hex | Usage |
|-------|-----|-------|
| `--red` | `#c0392b` | Player 2 indicator, Yatzy category tint |
| `--red-light` | `#e74c3c` | Hover on red elements |
| `--blue` | `#2980b9` | Player 1 indicator, info states |
| `--blue-light` | `#3498db` | Hover on blue elements |

### 2.4 Structural (Wood & Stone)

| Token | Hex | Usage |
|-------|-----|-------|
| `--wood` | `#5d3a1a` | Wooden trim, dice tray border |
| `--wood-light` | `#7a4e25` | Lighter wood accents |
| `--stone` | `#2c2c2c` | Dark borders, text on light |
| `--stone-light` | `#4a4a4a` | Muted borders |

### 2.5 Text Colors

| Token | Hex | Contrast on `#0d3b2e` | WCAG |
|-------|-----|----------------------|------|
| `--text` | `#f5f0e1` | 12.8:1 | ✅ AAA |
| `--text-muted` | `#a8b5a0` | 6.2:1 | ✅ AA+ |
| `--text-dark` | `#1a1a1a` | — | For light backgrounds |

### 2.6 Palette Reference

- [W3Schools CSS Colors](https://www.w3schools.com/css/css_colors.asp)
- [Coolors Palette Generator](https://coolors.co/)

---

## 3. Typography

### 3.1 Font Families

| Token | Stack | Purpose |
|-------|-------|---------|
| `--font-display` | `'Montserrat', 'Helvetica Neue', sans-serif` | Headings, game title, scores |
| `--font-body` | `'Open Sans', -apple-system, sans-serif` | Body text, descriptions |
| `--font-mono` | `'Fira Code', 'Courier New', monospace` | Score numbers, dice values, labels |

Loaded from **Google Fonts**:

```html
<link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=Montserrat:wght@600;700;800&family=Open+Sans:wght@400;500;600&display=swap" rel="stylesheet">
