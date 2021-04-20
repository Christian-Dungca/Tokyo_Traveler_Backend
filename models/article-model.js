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
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      // required: [true, "An article must have an author"],
    },
    introduction: {
      type: String,
      required: true,
    },
    tags: {
      type: String,
      enum: ["Before You Leave", "During Your Trip"],
      required: [true, "An article must have a tag"],
    },
    sections: [
      {
        heading: {
          type: String,
          required: [true, "A section must have a heading"],
        },
        content: {
          type: [String],
          required: [true, "A section must have content"],
        },
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

articleSchema.virtual("tableOfContents").get(function () {
  const headingList = this.sections.map((section) => {
    return section.heading;
  });

  return headingList;
});

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
