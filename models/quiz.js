const mongoose = require("mongoose");

const Card = require("./cards");
const User = require("./users");
const Response = require("./response");

var QuizSchema = new mongoose.Schema({
    deckId: {
        type: mongoose.Types.ObjectId,
        ref: 'Deck',
        required: true
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    score: {
        type: Number,
        required: true,
    },
    responses: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Response',
        }],
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model("Quiz", QuizSchema);
