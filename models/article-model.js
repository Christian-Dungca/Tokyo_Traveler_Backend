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
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "An article must have an author"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

articleSchema.pre(/^find/, function (next) {
  this.populate({
    path: "author",
    select: "-__v -password -email -active -createdAt -role",
  });
  next();
});

//Virtual Populate
// articleSchema.virtual("comments", {
//   ref: "Comment",
//   foreignField: "article",
//   localField: "_id",
// });

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
