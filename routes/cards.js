const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const { check } = require("express-validator");

const {addCard} = require("../controllers/cards");

// Add Deck
router.post(
    "/addCard",[
        auth,
        check("content","Enter Content for card").not().isEmpty(),
        check("deckId","Deck Id not present").exists()
    ],
    addCard
);

module.exports = router;