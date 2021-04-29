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

articleSchema.virtual("timestamp").get(function () {
  if(!this.createdAt) return;
  return this.createdAt.getTime();
});

articleSchema.virtual("createdAtFormatted").get(function () {
  if(!this.createdAt) return;
  const timestamp = this.createdAt.getTime();

  let months = [
    "January",
    "February",
    "March",
    "April",
    " May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let date = new Date(parseInt(timestamp));
  let year = date.getFullYear();
  let month = date.getMonth();
  let day = date.getDate();
  return `${months[month]} ${day}, ${year}`;
});

articleSchema.virtual("tableOfContents").get(function () {
  if(!this.sections) return;
  const headingList = this.sections.map((section) => {
    let sectionString = section.heading.split(" ").join("-");
    return sectionString;
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
