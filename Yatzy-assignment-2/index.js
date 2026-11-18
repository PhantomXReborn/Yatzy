/**
 * Express Server Entry Point
 * CST3106 — Assignment #2
 *
 * Serves the static client from /public and exposes the game API.
 */
const express = require("express");
const path = require("path");
const Game = require("./server");

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON request bodies
app.use(express.json());

// Serve static client files (index.html, css/, js/)
app.use(express.static(path.join(__dirname, "public")));

// In-memory store for active games (keyed by game ID)
const games = new Map();

// ==========================================
// API ROUTES
// ==========================================

// Create a new game
app.post("/api/game", (req, res) => {
  const { players = ["Player 1"] } = req.body || {};
  const state = Game.createGame(players);
  games.set(state.id, state);
  res.json(Game.snapshot(state));
});

// Get current game state
app.get("/api/game/:id", (req, res) => {
  const state = games.get(req.params.id);
  if (!state) return res.status(404).json({ error: "Game not found" });
  res.json(Game.snapshot(state));
});

// Roll dice
app.post("/api/game/:id/roll", (req, res) => {
  const state = games.get(req.params.id);
  if (!state) return res.status(404).json({ error: "Game not found" });

  const result = Game.rollDice(state);
  if (result.error) return res.status(400).json(result);

  res.json(Game.snapshot(state));
});

// Toggle die hold
app.put("/api/game/:id/hold", (req, res) => {
  const state = games.get(req.params.id);
  if (!state) return res.status(404).json({ error: "Game not found" });

  const result = Game.toggleHold(state, req.body?.index);
  if (result.error) return res.status(400).json(result);

  res.json(Game.snapshot(state));
});

// Score turn
app.post("/api/game/:id/score", (req, res) => {
  const state = games.get(req.params.id);
  if (!state) return res.status(404).json({ error: "Game not found" });

  const result = Game.scoreTurn(state, req.body?.category);
  if (result.error) return res.status(400).json(result);

  res.json(Game.snapshot(state));
});

// Delete a game (optional cleanup endpoint)
app.delete("/api/game/:id", (req, res) => {
  if (!games.has(req.params.id)) {
    return res.status(404).json({ error: "Game not found" });
  }
  games.delete(req.params.id);
  res.status(204).end();
});

// Start the server
app.listen(PORT, () => {
  console.log(`🎲 Yatzy server running at http://localhost:${PORT}`);
});