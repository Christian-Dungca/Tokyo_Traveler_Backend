const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
// var cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const HttpError = require("./models/http-error");
const errorHandler = require("./controllers/error-controller");
const articleRoutes = require("./routes/article-routes");
const userRoutes = require("./routes/user-routes");
const commentRoutes = require("./routes/comment-routes");

const app = express();
// Set security HTTP headers
app.use(helmet());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit Request from the same IP
const limiter = rateLimit({
  max: 300,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this IP, please try again in an hour!",
});
app.use("/api", limiter);

app.use(
  express.json({
    limit: "10kb",
  })
);

// Data sanitzation against NoSQL query injection
app.use(mongoSanitize());
// Data sanitization against XSS attacks
app.use(xss());
//Prevent parameter pollution
app.use(
  hpp({
    whitelist: ["title", "likes", "createdAt"],
  })
);

// app.use(cors());

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

// Test Middlewares
// app.use((req, res, next) => {
//   console.log(req.headers);
//   next();
// });

app.use("/api/articles", articleRoutes);
app.use("/api/users", userRoutes);
app.use("/api/comments", commentRoutes);

app.use("*", (req, res, next) => {
  const error = new HttpError(
    `Could not find the route: ${req.originalUrl} on this server`,
    404
  );
  return next(error);
});

app.use(errorHandler);

module.exports = app;
