const Article = require("../models/article-model");
const HttpError = require("../models/http-error");

const getArticles = async (req, res, next) => {
  // console.log(req.query);
  const { page, sort, limit, fields, ...queryObj } = req.query;
  try {
    // filtering
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    let query = Article.find(JSON.parse(queryString));

    // sorting
    if (sort) {
      // console.log(`sort: ${sort}`);
      const sortBy = sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query.sort("-createdAt");
    }

    // Field Limiting
    if (fields) {
      console.log(`fields: ${fields}`);
      const fieldStr = fields.split(",").join(" ");
      query = query.select(fieldStr);
    } else {
      query = query.select("-__v");
    }

    const pageN = page * 1 || 1;
    const limitN = limit * 1 || 2;
    const skip = (pageN - 1) * limitN;

    query = query.skip(skip).limit(limitN);

    if (page) {
      const numArticles = await Article.countDocuments();
      if (skip >= numArticles) throw Error("this page doesn't exit");
    }

    // execute query
    const allArticles = await query;

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
