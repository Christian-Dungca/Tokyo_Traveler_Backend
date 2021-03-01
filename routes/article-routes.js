const express = require("express");

const articleController = require("../controllers/article-controller");

const router = express.Router();

router.get("/", articleController.getArticles);
router.get("/:aid", articleController.getArticleById);
router.get("/user/:uid", articleController.getArticleByUserId)

module.exports = router;
