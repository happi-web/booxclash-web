// lobbyRoutes.js
const express = require("express");
const { joinLobby, getLobby, resetLobby } = require("../controllers/lobbyController");
const router = express.Router();

router.post("/join", joinLobby);
router.get("/", getLobby);
router.post("/reset", resetLobby);

module.exports = router;
