const Card = require('../models/cards');
const Response = require('../models/response');

const addResponse = async (ele) => {
    const { cardId, answer, correct } = ele;
    const card = await Card.findById(cardId);
    if (!card) {
        throw ("Card Not Found");
    }
    if (answer == null) throw ("Field Answer Not present");
    if (correct == null) throw ("Field correct Not present");
    const response = new Response({
        card,
        answer,
        correct
    });
    response.card = card;
    if(response.answer === '') response.answer = "Not Answered"
    var operRes = await response.save();
    if (operRes == null) {
        await Response.deleteOne({ _id: response.id });
        throw ("Error Adding Response");
    }

    if (operRes.modifiedCount < 1) {
        await Response.deleteOne({ _id: response.id });
        throw ("Error Adding Response");
    }
    return response;
};

module.exports = addResponse;