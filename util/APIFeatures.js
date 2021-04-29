const Article = require("../models/article-model");

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const { sort, limit, fields, page, ...queryObj } = this.queryString;
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query.find(JSON.parse(queryStr));

    // console.log(this.query);

    return this;
  }

  sort() {
    const { sort } = this.queryString;

    if (sort) {
      const sortBy = sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    // console.log(this.query);
    return this;
  }

  limitFields() {
    const { fields } = this.queryString;

    if (fields) {
      const fieldStr = fields.split(",").join(" ");
      console.log(`fieldStr -- ${fieldStr}`);
      this.query = this.query.select(fieldStr);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  paginate() {
    const { page, limit } = this.queryString;
    console.log(`limit: ${limit}`);

    const pageN = page * 1 || 1;
    const limitN = limit * 1 || 20;
    const skip = (pageN - 1) * limitN;

    this.query = this.query.skip(skip).limit(limitN);

    return this;
  }
}

module.exports = APIFeatures;
