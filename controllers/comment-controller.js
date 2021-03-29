const HttpError = require("../models/http-error");
const Comment = require("../models/comment-model");

exports.getAllComments = async (req, res, next) => {
  try {
    const comments = await Comment.find();

    res.status(200).json({
      status: "sucess",
      results: comments.length,
      data: {
        comments,
      },
    });
  } catch (err) {
    return next(new HttpError(err, 500));
  }
};

exports.createComment = async (req, res, next) => {
  try {
    if (!req.body.article) req.body.article = req.params.aid;
    if (!req.body.user) req.body.user = req.user.id;

    const newReview = await Comment.create(req.body);

    res.status(200).json({
      status: "sucess",
      data: {
        newReview,
      },
    });
  } catch (err) {
    return next(new HttpError(err, 500));
  }
};
