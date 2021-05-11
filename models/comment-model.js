// comment / createdAt / ref to article / ref to user
// parent referencing

const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      trim: true,
      maxlength: 250,
      minlength: 1,
      required: [true, "A comment must be between 1-250 characters long"],
    },
    createdAt: {
      type: Date,
      required: false,
      default: Date.now(),
    },
    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article",
      required: [true, "A comment must belong to an article."],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "A comment must belong to a user."],
    },
  },
  {
    toJSON: { virutals: true },
    toObject: { virutals: true },
  }
);

commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name",
  });
  next();
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
