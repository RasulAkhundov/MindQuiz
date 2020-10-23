const express = require('express');
const Quiz = require('../modules/Quiz');
const sharp = require('sharp');

const router = express.Router();

router.post('/create-quiz', (req, res) => {
    const{ image, category, questionAz, questionEn, questionRu, answers, correctAnswer } = req.body;

    if(image) {
        let parts = image.split(";");
        let mimType = parts[0].split(":")[1];
        let imageData = parts[1].split(",")[1];
        const img = new Buffer.from(imageData, "base64");

        let ext = mimType.includes('jpeg')
        ? mimType.slice('6', '10')
        : mimType.slice('6', '9');

        const imageName = `quiz-image-${Date.now()}`;

        sharp(img)
        .toFile(process.cwd() + `/public/upload/quiz-image/${category}/${imageName}.${ext}`)
        .then(data => {
            let quiz = new Quiz({
                image: `/upload/quiz-image/${category}/${imageName}.${ext}`,
                category,
                questionAz,
                questionEn,
                questionRu,
                answers,
                correctAnswer
            })
            quiz
            .save()
            .then(q => {
                res.status(200).json({
                    quiz: q
                })
            })
        })
        .catch(err => {
            if(err) {
                console.log('error from creating quiz' + err)
            }
        })
    } else {
        let quiz = new Quiz({
            category,
            questionAz,
            questionEn,
            questionRu,
            answers,
            correctAnswer
        })
        quiz
        .save()
        .then(q => {
            res.status(200).json({
                quiz: q
            })
        })
    }
});

router.get('/get-quiz/:category', (req, res) => {
    Quiz.aggregate(
        [
            { $match: { category: req.params.category } },
            { $sample: { size: 5 } }
        ]
    )
    .then(quizData => {
        if(!quizData) {
            console.log("error from getting quiz data")
        } else {
            res.status(200).json({ quizData });
        }
    })
})

module.exports = router;