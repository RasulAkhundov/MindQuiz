const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    image: { type: String },
    category: { type: String },
    questionAz: { type: String },
    questionEn: { type: String },
    questionRu: { type: String },
    answers: { type: Array },
    correctAnswer: { type: String }
});

let Quiz = mongoose.model('Quiz', schema);
module.exports = Quiz;