const mongoose = require("mongoose");

const Deck = require("./decks");

var UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	decks: {
		type: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Deck',
		}],
		required: false
	},
	friends: {
		type: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		}],
		required: false
	},
	requests: {
		type: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		}],
		required: false
	},
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema)
