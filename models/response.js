const mongoose = require("mongoose");

var CardSchema = require("mongoose").model("Card").schema;

var ResponseSchema = new mongoose.Schema({
    card: {
        type: CardSchema,
        required: true,
    },
    answer: {
        type: String,
        required: true,
    },
    correct: {
        type: Boolean,
        required: true,
    },
},{ timestamps: true });

module.exports = mongoose.model("Response", ResponseSchema);