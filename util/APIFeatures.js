
exports.filterFeature = (queryString) => {
    const queryObj = { ...queryString };
  
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    
    return JSON.parse(queryStr);
  };
  
exports.sortFeature = (query, sortObj) => {
    if (sortObj) {
      const sortBy = sortObj.split(",").join(" ");
      query = query.sort(sortBy);
      return query;
    } else {
      query.sort("-createdAt");
      return query;
    }
  };
  
exports.limitFieldsFeature = (query, fieldsObj) => {
    if (fieldsObj) {
      const fieldStr = fieldsObj.split(",").join(" ");
      query = query.select(fieldStr);
      return query;
    } else {
      query = query.select("-__v");
      return query;
    }
  };
  
exports.paginateFeature = (query, limit, page) => {
    const pageN = page * 1 || 1;
    const limitN = limit * 1 || 20;
    const skip = (pageN - 1) * limitN;
  
    query = query.skip(skip).limit(limitN);
  };
  