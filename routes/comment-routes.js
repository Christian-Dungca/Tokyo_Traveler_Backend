const express = require("express");
const commentController = require("../controllers/comment-controller");
const authController = require("../controllers/auth-controller");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(commentController.getAllComments)
  .post(
    authController.protectRoute,
    authController.restrictTo("user"),
    commentController.createComment
  );

module.exports = router;
