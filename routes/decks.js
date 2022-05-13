const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const { check } = require("express-validator");

const { addDeck, editDeck, deleteDeck } = require("../controllers/decks");

// Add Deck ̰
router.post(
    "/addDeck", [
    auth,
    check("name", "Enter a valid Deck Name").not().isEmpty(),
],
    addDeck
);

// Edit Deck
router.post(
    "/editDeck", [
    auth,
    check("deckId", "Deck Id not valid").exists(),
],
    editDeck
);

// Delete Deck
router.post(
    "/deleteDeck", [
    auth,
    check("deckId", "Deck Id not valid").exists(),
],
    deleteDeck
);
module.exports = router;
