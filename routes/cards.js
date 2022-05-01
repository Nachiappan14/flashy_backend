const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const { check } = require("express-validator");

const { addCard, editCard } = require("../controllers/cards");

// Add Card
router.post(
    "/addCard", [
    auth,
    check("content", "Enter Content for card").not().isEmpty(),
    check("deckId", "Deck Id not present").exists()
],
    addCard
);


// Edit Card
router.post(
    "/editCard", [
    auth,
    check("cardId", "Card Id does not exist").exists()
],
    editCard
);


module.exports = router;