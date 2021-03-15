const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");
const User = require("./../models/user-model");

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password, passwordConfirm } = req.body;

    const newUser = await User.create({
      name,
      email,
      password,
      passwordConfirm,
    }).catch((err) => {
      throw err;
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(201).json({
      status: "success",
      token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }
};
