const express = require("express");

const articleController = require("../controllers/article-controller");
const authController = require("./../controllers/auth-controller");
const commentRoutes = require("./comment-routes");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();

router.use("/:aid/comments", commentRoutes);

router.get("/user/:uid", articleController.getArticlesByUserId);

router.route("/").get(articleController.getArticles).post(
  authController.protectRoute,
  authController.restrictTo("author"),
  // fileUpload.single("image[0]"),
  fileUpload.any(),
  articleController.createArticle
);

router
  .route("/:aid")
  .get(articleController.getArticleById)
  .patch(
    authController.protectRoute,
    authController.restrictTo("author"),
    articleController.updateArticle
  )

  .delete(
    authController.protectRoute,
    authController.restrictTo("admin", "author"),
    articleController.deleteArticle
  );

module.exports = router;
