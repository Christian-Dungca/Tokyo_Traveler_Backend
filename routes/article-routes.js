const express = require("express");

const articleController = require("../controllers/article-controller");

const router = express.Router();

router.get("/", articleController.getArticles);
router.get("/:aid", articleController.getArticleById);
router.get("/user/:uid", articleController.getArticleByUserId);

router.post("/", articleController.createArticle);
router.patch('/:aid', articleController.updateArticle);
router.delete('/:aid', articleController.deleteArticle);

module.exports = router;
