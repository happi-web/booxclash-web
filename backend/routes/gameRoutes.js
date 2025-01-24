const express = require("express");
const router = express.Router();

router.get("/question", (req, res) => {
  res.json({ question: getQuestion() });
});

module.exports = router;
