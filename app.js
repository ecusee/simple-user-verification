const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const exphbs = require("express-handlebars");
const dotenv = require("dotenv");
const path = require("path");

// Load Config
dotenv.config({ path: "./config/config.env" });

connectDB();
const app = express();
const PORT = process.env.PORT || 5000;

//Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


//Handlebars
app.engine(".hbs", exphbs({ defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", ".hbs");

// Static Folder
app.use(express.static("public"));

// Routes
app.use("/api/user", require("./routes/auth"));

app.get("/", (req, res) => {
  res.render('pages/home');
});

app.listen(PORT, () => console.log(`Server up and running on port ${PORT}`));
