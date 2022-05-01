const { validationResult } = require("express-validator");
const flog = require("../utils/log");

const Deck = require('../models/decks');
const User = require('../models/users');
const { default: mongoose } = require("mongoose");

module.exports.addDeck = async function (req, res) {
    // logging the required informaton
    var id = null;
    if (req.user != undefined) id = req.user.id;
    var logText = req.method + " " + req.originalUrl + " " + id + " ";

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        flog(logText + "400");
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, tags } = req.body;
    const userId = [];

    try {
        let user = await User.findById(id).populate('decks');
        if (!user) {
            flog(logText + "400");
            return res.status(400).json({ errors: [{ msg: "User Not present" }] });
        }

        const deck = new Deck({
            name,
            userId,
            tags
        });

        deck.name = name;
        deck.userId.push(user);
        if (tags != undefined) deck.tags = tags;
        else deck.tags = [];

        await deck.save();

        // var operRes = await User.updateOne({ _id: id }, { $push: { decks: deck } });

        // console.log(user);
        user.decks.push(deck);
        var operRes = await user.save();

        // console.log(operRes);

        if (operRes == null) {
            flog(logText + "400");
            await Deck.deleteOne({ _id: deck.id });
            return res.status(400).json({ errors: [{ msg: "Deck cannot be added" }] });
        }

        if (operRes.modifiedCount < 1) {
            flog(logText + "400");
            await Deck.deleteOne({ _id: deck.id });
            return res.status(400).json({ errors: [{ msg: "Deck cannot be added to user" }] });
        }
        flog(logText + "200");
        res.json({ msg: "Deck Addition Successful..." });

    } catch (err) {
        console.error("Error: ", err.message);
        flog(logText + "500");
        return res.status(500).send("Internal Server Error");
    }
}

module.exports.editDeck = async function (req, res) {
    // logging the required informaton
    var id = null;
    if (req.user != undefined) id = req.user.id;
    var logText = req.method + " " + req.originalUrl + " " + id + " ";

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        flog(logText + "400");
        return res.status(400).json({ errors: errors.array() });
    }

    const { deckId, name, tags } = req.body;

    try {
        var deck = null;

        deckObjId = mongoose.Types.ObjectId(deckId);
        deck = await Deck.findById(deckObjId);

        if (!deck) {
            flog(logText + "400");
            return res.status(400).json({ errors: [{ msg: "Deck Not Found" }] });
        }

        if (!deck.userId.includes(id)) {
            flog(logText + "400");
            return res.status(400).json({ errors: [{ msg: "Not Authorized to modify deck" }] });
        }

        if (name) deck.name = name;

        if (tags != undefined) deck.tags = tags;

        var operRes = await deck.save();

        if (operRes == null) {
            flog(logText + "400");
            return res.status(400).json({ errors: [{ msg: "Deck cannot be editted" }] });
        }

        if (operRes.modifiedCount < 1) {
            flog(logText + "400");
            return res.status(400).json({ errors: [{ msg: "Deck cannot be editted" }] });
        }
        flog(logText + "200");
        res.json({ msg: "Edit Deck Successful..." });

    } catch (err) {
        console.error("Error: ", err.message);
        flog(logText + "500");
        return res.status(500).send("Internal Server Error");
    }
}

/*
module.exports.deleteDeck = async function (req, res) {
    // logging the required informaton
    var id = null;
    if (req.user != undefined) id = req.user.id;
    var logText = req.method + " " + req.originalUrl + " " + id + " ";

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        flog(logText + "400");
        return res.status(400).json({ errors: errors.array() });
    }

    const { deckId } = req.body;

    try {
        let deck = await Deck.findById(deckId);
        if (!deck) {
            flog(logText + "400");
            return res.status(400).json({ errors: [{ msg: "Deck Not Found" }] });
        }


        var user = await User.findById(deck.userId);
        if (!deck) {
            flog(logText + "400");
            return res.status(400).json({ errors: [{ msg: "Deck Not Found" }] });
        }

        deck.cards = deck.cards.filter((ele) => (ele != cardId));

        var operRes = await Card.deleteOne({ _id: cardId });

        await deck.save();

        // console.log(operRes);

        if (operRes == null) {
            flog(logText + "400");
            return res.status(400).json({ errors: [{ msg: "Card cannot be Deleted" }] });
        }

        if (operRes.modifiedCount < 1) {
            flog(logText + "400");
            return res.status(400).json({ errors: [{ msg: "Card cannot be deleted" }] });
        }
        flog(logText + "200");
        res.json({ msg: "Card Deletion Successful..." });

    } catch (err) {
        console.error("Error: ", err.message);
        flog(logText + "500");
        return res.status(500).send("Internal Server Error");
    }
}
*/