const mongoose = require("mongoose");

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
    }
});

module.exports = mongoose.model("Card", CardSchema);