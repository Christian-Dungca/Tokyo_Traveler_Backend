const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
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
    likes: {
      type: Number,
      required: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//Virtual Populate
articleSchema.virtual("comments", {
  ref: "Comment",
  foreignField: "article",
  localField: "_id",
});

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
