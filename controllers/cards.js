const { validationResult } = require("express-validator");
const flog = require("../utils/log");

const Card = require('../models/cards');
const Deck = require('../models/decks');
const User = require('../models/users');

module.exports.addCard = async function (req, res) {
    // logging the required informaton
    var id = null;
    if (req.user != undefined) id = req.user.id;
    var logText = req.method + " " + req.originalUrl + " " + id + " ";

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        flog(logText + "400");
        return res.status(400).json({ errors: errors.array() });
    }

    const { content, question, answer, deckId } = req.body;
    // const deckId = null;

    try {
        let deck = await Deck.findById(deckId).populate('cards');
        if (!deck) {
            flog(logText + "400");
            return res.status(400).json({ errors: [{ msg: "Deck Not Found" }] });
        }

        // console.log(deck.userId, "==", id);
        // console.log(deck.userId.includes(id));

        if (!deck.userId.includes(id)) {
            flog(logText + "400");
            return res.status(400).json({ errors: [{ msg: "Not Authorized to add card" }] });
        }

        const card = new Card({
            content,
            question,
            answer,
            deckId
        });


        card.deckId = deck;
        await card.save();

        // console.log(deck);
        deck.cards.push(card);

        var operRes = await deck.save();

        // console.log(operRes);

        if (operRes == null) {
            flog(logText + "400");
            await Card.deleteOne({ _id: card.id });
            return res.status(400).json({ errors: [{ msg: "Card cannot be added" }] });
        }

        if (operRes.modifiedCount < 1) {
            flog(logText + "400");
            await Card.deleteOne({ _id: card.id });
            return res.status(400).json({ errors: [{ msg: "Card cannot be added to deck" }] });
        }
        flog(logText + "200");
        res.json({ msg: "Card Addition Successful..." });

    } catch (err) {
        console.error("Error: ", err.message);
        flog(logText + "500");
        return res.status(500).send("Internal Server Error");
    }
}


module.exports.editCard = async function (req, res) {
    // logging the required informaton
    var id = null;
    if (req.user != undefined) id = req.user.id;
    var logText = req.method + " " + req.originalUrl + " " + id + " ";

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        flog(logText + "400");
        return res.status(400).json({ errors: errors.array() });
    }

    const { content, question, answer, deckId, cardId } = req.body;

    try {
        let oldCard = await Card.findById(cardId);
        let card = await Card.findById(cardId);
        if (!card) {
            flog(logText + "400");
            return res.status(400).json({ errors: [{ msg: "Card Not Found" }] });
        }

        let oldDeck = await Deck.findById(card.deckId);

        if (!oldDeck.userId.includes(id)) {
            flog(logText + "400");
            return res.status(400).json({ errors: [{ msg: "Not Authorized to access deck of card" }] });
        }

        var deck = null;
        if (deckId) {
            deck = await Deck.findById(deckId);
            if (!deck) {
                flog(logText + "400");
                return res.status(400).json({ errors: [{ msg: "Deck Not Found" }] });
            }
            if (!deck.userId.includes(id)) {
                flog(logText + "400");
                return res.status(400).json({ errors: [{ msg: "Not Authorized to access Deck" }] });
            }
            card.deckId = deck;
        }

        oldDeck.cards = oldDeck.cards.filter((ele)=> (ele!=cardId));
        await oldDeck.save();

        if (content) card.content = content;
        if (question) card.question = question;
        if (answer) card.answer = answer;
        // console.log(deck.userId, "==", id);
        // console.log(deck.userId.includes(id));

        await card.save();

        deck.cards.push(card);

        var operRes = await deck.save();

        // console.log(operRes);

        if (operRes == null) {
            flog(logText + "400");
            await Card.updateOne({ _id: card.id }, oldCard);
            oldDeck.cards.push(oldCard);
            await oldDeck.save();
            return res.status(400).json({ errors: [{ msg: "Card cannot be Editted" }] });
        }

        if (operRes.modifiedCount < 1) {
            flog(logText + "400");
            await Card.updateOne({ _id: card.id }, oldCard);
            oldDeck.cards.push(oldCard);
            await oldDeck.save();
            return res.status(400).json({ errors: [{ msg: "Card cannot be editted" }] });
        }
        flog(logText + "200");
        res.json({ msg: "Card Edit Successful..." });

    } catch (err) {
        console.error("Error: ", err.message);
        flog(logText + "500");
        return res.status(500).send("Internal Server Error");
    }
}