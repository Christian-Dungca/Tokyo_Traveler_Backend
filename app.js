const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const HttpError = require("./models/http-error");
const errorHandler = require("./controllers/error-controller");
const articleRoutes = require("./routes/article-routes");
const userRoutes = require("./routes/user-routes");

const app = express();

// Global Middlewares
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this IP, please try again in an hour!",
});

app.use("/api", limiter);

app.use(express.json());
app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use((req, res, next) => {
  // console.log(req.headers);
  next();
});

app.use("/api/articles", articleRoutes);
app.use("/api/users", userRoutes);

app.use("*", (req, res, next) => {
  const error = new HttpError(
    `Could not find the route: ${req.originalUrl} on this server`,
    404
  );
  return next(error);
});

app.use(errorHandler);

module.exports = app;
