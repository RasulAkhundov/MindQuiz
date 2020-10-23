let express = require("express");
let Category = require("../modules/Category");
let fs = require("fs");
let sharp = require("sharp");

let router = express.Router();

router.post("/create-category", function(req, res) {
    const { image, nameAz, nameEn, nameRu, level, xp, bioAz, bioEn, bioRu } = req.body;

    ///create quiz image folder in category name
    let folder = `./public/upload/quiz-image/${nameAz}`;

    if(!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
    } else {
        console.log('quiz image folder is already exist');
    }

    ////Sharp image upload
    let parts = image.split(";");
    let mimType = parts[0].split(":")[1];
    let imageData = parts[1].split(",")[1];
    const img = new Buffer.from(imageData, "base64");

    let ext = mimType.includes('jpeg')
    ? mimType.slice('6', '10')
    : mimType.slice('6', '9');

    const imageName = `category-image-${Date.now()}`;

    sharp(img)
    .toFile(process.cwd() + `/public/upload/category-image/${imageName}.${ext}`)
    .then(data => {
        let category = new Category({
            image: `/upload/category-image/${imageName}.${ext}`,
            nameAz,
            nameEn,
            nameRu,
            level,
            xp,
            bioAz,
            bioEn,
            bioRu
        })
        category
        .save()
        .then(c => {
            res.status(200).json({
                category: c
            })
        })
    })
    .catch(err => {
        if(err) {
            console.log("catch error from create category");
        }
    })
});

///Getting all categories
router.get("/category-get", (req, res) => {
    
    Category.find()
    .sort({ _id: -1 })
    .then(categoryGet => {
        if(!categoryGet) {
            console.log("error from getting category");
        } else {
            res.status(200).json({ categoryGet });
        }
    })
})

///Getting one category
router.get('/category', (req, res) => {
    Category.findById(req.query.id)
    .then(categoryGet => {
        if(!categoryGet) {
            console.log("error from getting one category");
        } else {
            res.status(200).json({ categoryGet });
        }
    })
})

module.exports = router;