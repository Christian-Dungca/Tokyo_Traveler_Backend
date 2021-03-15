const HttpError = require("../models/http-error");

const sendDevError = (err, res) => {
  res.json({
    status: err.code,
    err,
    message: err.message || "An unknown error occurred",
    stack: err.stack,
  });
};

const sendProdError = (err, res) => {
  if (err.isOperational) {
    res.json({
      err,
      status: err.code,
      message: err.message || "An unknown error occurred",
    });
  } else {
    console.error("ERROR ❌", err);
    res.json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new HttpError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value.`;
  return new HttpError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.value(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new HttpError(message, 400);
};

module.exports = (err, req, res, next) => {
  res.status(err.code || 500);

  if (process.env.NODE_ENV === "development") {
    sendDevError(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    
    if (err.name === "CastError") error = handleCastErrorDB(error);
    if (err.code === 1100) error = handleDuplicateFieldsDB(error);
    if (err.name === "ValidationError") error = handleValidationErrorDB(error);

    sendProdError(error, res);
  }
};
