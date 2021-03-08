const express = require("express");
const bodyParser = require("body-parser");

const HttpError = require("./models/http-error");
const articleRoutes = require("./routes/article-routes");
const userRoutes = require("./routes/user-routes");

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
  // Which Servers can access resources
  res.setHeader("Access-Control-Allow-Origin", "*");
  // Which Headers are allowed to access resources
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  // Which HTTP methods are allowed to be used on the server
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE")
  next();
});

app.use("/api/articles", articleRoutes);
app.use("/api/users", userRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred" });
});

module.exports = app;
