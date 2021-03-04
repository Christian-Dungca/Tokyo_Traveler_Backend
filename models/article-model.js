const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "An article must have title"],
  },
  image: {
    type: String,
    required: [true, "An article must have an image provided"],
  },
  createdAt: {
    type: Date,
    required: false,
    default: Date.now(),
  },
  content: {
    type: [String],
    required: [true, "An article must have content"],
  },
  comments: {
    type: [String],
    required: false,
  },
  likes: {
    type: [Number],
    required: false,
  },
});

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
