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
    const articles = await query.query;

    res.status(200).json({
      status: "success",
      results: articles.length,
      data: { articles },
    });
  } catch (err) {
    const error = new HttpError(`Could not retrieve articles`, 400);
    return next(error);
  }
};

// need this for Author Page maybe?
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
    const article = await Article.findById(articleId).populate({
      path: "author",
      select: "-__v -password -email -active -createdAt -role",
    });

    if (!article) {
      return next(new HttpError("No article found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: { article },
    });
  } catch (err) {
    next(err);
  }
};

const createArticle = async (req, res, next) => {
  try {
    const { title, image, createdAt, introduction, tags, sections } = req.body;

    const authorId = req.user._id;

    const newArticle = await Article.create({
      title,
      image,
      introduction,
      tags,
      sections,
      author: authorId,
    });

    if (!newArticle) {
      return next(new HttpError("Could not create a new Article", 404));
    }

    res.status(201).json({
      status: "success",
      data: { newArticle },
    });
  } catch (err) {
    next(err);
  }
};

const updateArticle = async (req, res, next) => {
  try {
    const articleId = req.params.aid;
    const article = await Article.findById(articleId);

    if (!article) {
      return next(new HttpError("Could not find an article with that ID", 404));
    }

    // console.log(req.body);
    const updatedArticle = await Article.findOneAndUpdate(
      { _id: article._id },
      req.body,
      { new: true, runValidators: true },
      function (err) {
        if (err) {
          // const error = new HttpError(
          //   `Could not update article with id of ${articleId}`,
          //   500
          // );
          return next(err);
        }
      }
    );

    updatedArticle.save();

    res.status(201).json({
      status: "success",
      data: { updatedArticle },
    });
  } catch (err) {
    return next(err);
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
