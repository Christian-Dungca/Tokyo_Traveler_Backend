class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const { sort, limit, fields, ...queryObj } = this.queryString;
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    console.log(queryStr);
    this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    const { sort } = this.queryString;
    if (sort) {
      const sortBy = sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    const { fields } = this.queryString;
    console.log(fields);
    if (fields) {
      const fieldStr = fields.split(",").join(" ");
      this.query = this.query.select(fieldStr);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  paginate() {
    const { page, limit } = this.queryString;

    const pageN = page * 1 || 1;
    const limitN = limit * 1 || 20;
    const skip = (pageN - 1) * limitN;

    this.query = this.query.skip(skip).limit(limitN);
  }
}

module.exports = APIFeatures;
