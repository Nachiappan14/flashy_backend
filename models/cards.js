const mongoose = require("mongoose");

const Deck = require("./decks");

var CardSchema = new mongoose.Schema({
    question: {
        type: String,
        required: false,
    },
    answer: {
        type: String,
        required: false,
    },
    content: {
        type: String,
        required: true,
    },
    deckId: {
        type: mongoose.Types.ObjectId,
        ref: 'Deck',
        required: true
    }
});

module.exports = mongoose.model("Card", CardSchema);