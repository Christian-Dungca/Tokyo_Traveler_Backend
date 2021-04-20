const express = require("express");

const articleController = require("../controllers/article-controller");
const authController = require("./../controllers/auth-controller");
const commentRoutes = require("./comment-routes");

const router = express.Router();

router.use("/:aid/comments", commentRoutes);

router
  .route("/")
  .get(articleController.getArticles)
  .post(
    authController.protectRoute,
    authController.restrictTo("author"),
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

router.get("/user/:uid", articleController.getArticleByUserId);

module.exports = router;
