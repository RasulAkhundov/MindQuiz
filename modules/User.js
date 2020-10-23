const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const uniqueValidator = require("mongoose-unique-validator");

const schema = new mongoose.Schema({
    image: { type: String, required: true },
    email: { type: String, trim: true, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    gender: { type: String, required: true },
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 },
    cup: { type: Number, default: 0 },
    levelUpXp: { type: Number, default: 100 },
    password: { type: String }
});

//Password Hashing
schema.methods.setPassword = function setPassword(password) {
    this.password = bcrypt.hashSync(password, 10);
}
schema.methods.checkPassword = function checkPassword(password) {
    return bcrypt.compareSync(password, this.password);
}

//JSONWEBTOKEN
schema.methods.generateJWT = function generateJWT() {
    return jwt.sign(
        {
            _id: this._id,
            image: this.image,
            email: this.email,
            username: this.username,
            password: this.password,
            gender: this.gender
        },
        '123456789'
    )
}

schema.plugin(uniqueValidator);

const User = mongoose.model('User', schema);
module.exports = User;