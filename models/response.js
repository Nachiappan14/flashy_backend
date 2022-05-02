const mongoose = require("mongoose");

const Card = require("./cards");
const User = require("./users");
const Quiz = require("./quiz");

var ResponseSchema = new mongoose.Schema({
    cardId: {
        type: mongoose.Types.ObjectId,
        ref: 'Card',
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    correct: {
        type: Boolean,
        required: true,
    },
});

module.exports = mongoose.model("Response", ResponseSchema);