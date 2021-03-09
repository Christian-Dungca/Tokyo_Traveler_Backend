const fs = require("fs");
const { dirname } = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Article = require("../../models/article-model");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection succesfful"));

const articles = JSON.parse(
  fs.readFileSync(`${__dirname}/articles.json`, "utf-8")
);

const importData = async () => {
  try {
    await Article.insertMany(articles);
    console.log("Sucessfully Imported Data");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Article.deleteMany();
    console.log("Successfully Deleted All Data");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData ();
} else if (process.argv[2] === "--delete") {
    deleteData();
}

