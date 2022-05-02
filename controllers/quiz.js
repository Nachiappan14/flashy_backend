const { validationResult } = require("express-validator");
const flog = require("../utils/log");

const Card = require('../models/cards');
const Deck = require('../models/decks');
const User = require('../models/users');
const Response = require('../models/response');
const Quiz = require('../models/quiz');

const addResponse = require('./response');

module.exports.addQuiz = async function (req, res) {
    // logging the required informaton
    var id = null;
    if (req.user != undefined) id = req.user.id;
    var logText = req.method + " " + req.originalUrl + " " + id + " ";

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        flog(logText + "400");
        return res.status(400).json({ errors: errors.array() });
    }

    const userId = id;
    if (!userId) {
        flog(logText + "400");
        return res.status(400).json({ errors: [{ msg: "User Not Authorized to Take Quiz" }] });
    }

    const { responses, score, deckId } = req.body;

    try {
        // let deck = await Deck.findById(deckId).populate('cards');
        let deck = await Deck.findById(deckId);
        if (!deck) {
            flog(logText + "400");
            return res.status(400).json({ errors: [{ msg: "Deck Not Found" }] });
        }

        let user = await User.findById(userId);
        if (!user) {
            flog(logText + "400");
            return res.status(400).json({ errors: [{ msg: "User Not Found" }] });
        }

        if (!user.decks.includes(deckId)) {
            flog(logText + "400");
            return res.status(400).json({ errors: [{ msg: "Not Authorized to take quiz..." }] });
        }

        // get the responses list somehow
        if (!Array.isArray(responses)) {
            flog(logText + "400");
            return res.status(400).json({ errors: [{ msg: "Responses not valid" }] });
        }

        const quiz = new Quiz({
            deckId,
            userId,
            score,
            responses
        });

        quiz.deckId = deck;
        quiz.userId = user;
        quiz.score = score;
        quiz.responses = [];

        // Use some for loop to iterate through the responses and add them
        try {
            responses.map(async (ele) => {
                let response = await addResponse(ele);
                quiz.responses.push(response);
            });
        } catch (err) {
            flog(logText + "400");
            await Response.deleteMany({ _id: responses });
            return res.status(400).json({ errors: [{ msg: "Quiz cannot be added bcos of invalid response", err: err }] });
        }

        var operRes = await quiz.save();

        if (operRes == null) {
            flog(logText + "400");
            await Quiz.deleteOne({ _id: quiz.id });
            return res.status(400).json({ errors: [{ msg: "Quiz cannot be added" }] });
        }

        if (operRes.modifiedCount < 1) {
            flog(logText + "400");
            await Quiz.deleteOne({ _id: quiz.id });
            return res.status(400).json({ errors: [{ msg: "Quiz cannot be added to db" }] });
        }
        flog(logText + "200");
        res.json({ msg: "Quiz Addition Successful..." });

    } catch (err) {
        console.error("Error: ", err.message);
        flog(logText + "500");
        return res.status(500).send("Internal Server Error");
    }
}

module.exports.getQuiz = async function (req, res) {
    // logging the required informaton
    var id = null;
    if (req.user != undefined) id = req.user.id;
    var logText = req.method + " " + req.originalUrl + " " + id + " ";

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        flog(logText + "400");
        return res.status(400).json({ errors: errors.array() });
    }

    const userId = id;
    if (!userId) {
        flog(logText + "400");
        return res.status(400).json({ errors: [{ msg: "User Not Logged in" }] });
    }

    try {

        let user = await User.findById(userId);
        if (!user) {
            flog(logText + "400");
            return res.status(400).json({ errors: [{ msg: "User Not Found" }] });
        }

        const quizzes = await Quiz.find({ userId }).populate({
            path: 'responses'
        });

        flog(logText + "200");
        return res.json({ data: quizzes });

    } catch (err) {
        console.error("Error: ", err.message);
        flog(logText + "500");
        return res.status(500).send("Internal Server Error");
    }
}