const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.log("Unhandled Exception ❌, Shutting Down Server...");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });
const app = require("./app");
const HttpError = require("./models/http-error");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection successful ✅"))
  .catch((err) => {
    return next(new HttpError(err, 500));
  });
const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`App is listening on port ${port}... 🍾`);
});

process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection ❌, Shutting Down Server...");
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});
