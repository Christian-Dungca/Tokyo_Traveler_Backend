const Article = require("../models/article-model");
const HttpError = require("../models/http-error");
const APIFeatures = require("../util/APIFeatures");

const getArticles = async (req, res, next) => {
  try {
    const { page, sort, limit, fields, ...queryObj } = req.query;

    const query = new APIFeatures(Article.find(), req.query)
      .filter()
      .sort()
      .limitFields();

    // execute query
    const allArticles = await query.query;

    res.status(200).json({
      status: "success",
      results: allArticles.length,
      data: { allArticles },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

const getArticleByUserId = (req, res, next) => {
  //   const userId = req.params.uid;
  //   let userArticles;
  //   try {
  //     userArticles = DUMMY_ARTICLES.filter((article) => {
  //       return article.author.id === userId;
  //     });
  //     if (userArticles.length === 0) {
  //       throw "Could not find articles for that user";
  //     }
  //   } catch (err) {
  //     const Error = new HttpError(err, 401);
  //     return next(Error);
  //   }
  //   res.json({ data: userArticles });
};

const getArticleById = async (req, res, next) => {
  try {
    const articleId = req.params.aid;
    const article = await Article.findById(articleId);
    res.status(200).json({
      status: "success",
      data: { article },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

const createArticle = async (req, res, next) => {
  try {
    const newArticle = await Article.create(req.body);
    res.status(201).json({
      status: "success",
      data: { newArticle },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

const updateArticle = async (req, res, next) => {
  try {
    const articleId = req.params.aid;
    const updatedArticle = await Article.findByIdAndUpdate(
      articleId,
      req.body,
      { new: true, runValidators: true }
    );
    res.status(201).json({
      status: "success",
      data: { updatedArticle },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

const deleteArticle = async (req, res, next) => {
  try {
    const articleId = req.params.aid;
    const deletedArticle = await Article.findByIdAndDelete(articleId);
    res.status(201).json({
      status: "success",
      data: { deletedArticle },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getArticles = getArticles;
exports.getArticleByUserId = getArticleByUserId;
exports.getArticleById = getArticleById;
exports.createArticle = createArticle;
exports.updateArticle = updateArticle;
exports.deleteArticle = deleteArticle;
