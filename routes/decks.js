const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const { check } = require("express-validator");

const {addDeck} = require("../controllers/decks");

// Add Deck
router.post(
    "/addDeck",[
        auth,
        check("name","Enter a valid Deck Name").not().isEmpty(),
    ],
    addDeck
);

module.exports = router;