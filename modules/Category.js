let mongoose = require("mongoose");

const schema = new mongoose.Schema({
    image: { type: String, required: true },
    nameAz: { type: String, required: true },
    nameEn: { type: String, required: false },
    nameRu: { type: String, required: false }, 
    level: { type: Number, required: true },
    xp: { type: Number, required: true },
    bioAz: { type: String, required: true },
    bioEn: { type: String, required: false },
    bioRu: { type: String, required: false }
});

let Category = mongoose.model("Category", schema);
module.exports = Category;