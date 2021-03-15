const HttpError = require("../models/http-error");
const User = require("./../models/user-model");

exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body).catch((err) => {
      throw err;
    });

    res.status(201).json({
      status: "success",
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }
};
