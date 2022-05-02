const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const { check } = require("express-validator");

const { addQuiz, getQuiz } = require("../controllers/quiz");

// Add Quiz
router.post(
    "/addQuiz", [
    auth,
    check("deckId", "Deck Id does not exist").exists(),
    check("score", "score not available").exists(),
    check("responses", "Reponse not available").exists(),
],
    addQuiz
);

// Get Quiz
router.get(
    "/getQuiz", [
    auth,
],
    getQuiz
);

module.exports = router;