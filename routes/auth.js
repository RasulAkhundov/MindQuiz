const express = require("express");
const { check, validationResult } = require('express-validator');
const User = require('../modules/User.js');
const router = express.Router();

router.post(
    "/register",
    [
        check('email', 'Zəhmət olmasa etibarlı bir e-poçt daxil edin.').isEmail(),
        check('username', 'istifadəçi adı çox qısadır!').isLength({ min: 4, max: 20 }),
        check('password', 'Şifrə çox qısadır minimum 6 işarə!').isLength({ min: 6, max: 255 })
    ], (req, res) => {
        const { image, email, username, gender, level, xp, levelUpXp, password } = req.body;

        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            
            const alert = errors.array();
            if(alert.length > 0) {
                res.send({ alert: alert })
            }
            
        } else {
            const user = new User({
                image,
                email,
                username,
                gender,
                level,
                xp,
                levelUpXp
            })
            user.setPassword(password)
            user
            .save()
            .then(newUser => {
                res.status(200).json({ user: newUser.generateJWT() })
            })
            .catch(err => {
                res.json({ error: err });
            })
        }
    }
)

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    await User.findOne({ email }).then(user => {
        if(user) {
            if(user.checkPassword(password)) {
                res.json({ user: user.generateJWT() });
            } else {
                res.send({ alert: { msg: "Şifrə uyğun deyil!" } })
            }
        } else {
            res.send({ alert: { msg: "e-poçt tapIlmadı!" } })
        }
    })
});

//GEtting one user me
router.get("/user/:id", (req, res) => {
    User.findById(req.params.id)
    .then(userInfo => {
        if(!userInfo) {
            console.log("error from getting user");
        } else {
            res.status(200).json({ userInfo });
        }
    })
});

//Getting all users for leader board
router.get('/leader-board-players', (req, res) => {
    User.find()
    .sort({ cup: -1 })
    .limit(999)
    .then(board => {
        if(!board) {
            console.log("error from getting all users leader board")
        } else {
            res.status(200).json({ board });
        }
    })
})

//Getting one users me for leader board
router.get('/leader-board-me/:cup', (req, res) => {
    User.find(
        { 
            cup: {
                $gte: req.params.cup
            } 
        }
    )
    .countDocuments()
    .then(boardMe => {
        if(!boardMe) {
            console.log("error from getting me for leader board")
        } else {
            res.status(200).json({ boardMe });
        }
    })
})

module.exports = router;