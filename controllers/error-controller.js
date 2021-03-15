const sendDevError = (err, res) => {
  res.json({
    status: err.status,
    err,
    message: err.message || "An unknown error occurred",
    stack: err.stack,
  });
};

const sendProdError = (err, res) => {
  if (err.isOperational) {
    res.json({
      status: err.status,
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

module.exports = (err, req, res, next) => {
  if (res.headerSent) {
    return next(err);
  }

  res.status(err.code || 500);

  if (process.env.NODE_ENV === "development") {
    sendDevError(err, res);
  } else {
    sendProdError(err, res);
  }
};
