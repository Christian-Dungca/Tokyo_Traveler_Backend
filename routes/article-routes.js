const express = require("express");

const articleController = require("../controllers/article-controller");

const router = express.Router();

router
  .route("/")
  .get(articleController.getArticles)
  .post(articleController.createArticle);

router
  .route("/:aid")
  .get(articleController.getArticleById)
  .patch(articleController.updateArticle)
  .delete(articleController.deleteArticle);

router.get("/user/:uid", articleController.getArticleByUserId);

module.exports = router;
