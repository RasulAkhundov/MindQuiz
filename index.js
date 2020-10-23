const app = require("express")();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

// routerler
const auth = require("./routes/auth");
const category = require("./routes/category");
const quiz = require("./routes/quiz");

// middleware
app.set("view engine", "ejs");
app.use(require("express").static("public"));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());

//router init
app.use('/api', auth);
app.use('/api', category);
app.use('/api', quiz);

//register
app.get("/register", (req, res) => {
    res.render('register');
});

//login
app.get("/login", (req, res) => {
    res.render('login');
});

//dashboard
app.get("/", (req, res) => {
    res.render('dashboard');
});

//admin panel
app.get("/admin-panel", (req, res) => {
    res.render('admin-panel');
});

//category
app.get("/category", (req, res) => {
    res.render('category');
});

//leader board
app.get("/leader-board", (req, res) => {
    res.render('leader-board');
});

app.get("/*", (req, res) => {
    res.send("error 404 not found");
})

// mongoose connect
mongoose.set("useCreateIndex", true);
mongoose.connect(
  "mongodb://localhost/rasul-quiz",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  },
  () => console.log("mongodb is ready")
);

app.listen(4000, () => {
    console.log("server started at 4000")
})