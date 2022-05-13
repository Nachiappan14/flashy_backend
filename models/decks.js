const mongoose = require("mongoose");
const Card = require("./cards");
const User = require("./users");

var DeckSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    userId: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }],
        required: true,
    },
    tags: {
        type: [String],
        required: false,
    },
    cards: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Card',
        }],
        required: false
    }
}, { timestamps: true });

module.exports = mongoose.model("Deck", DeckSchema);
