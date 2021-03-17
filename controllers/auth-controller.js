const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");
const User = require("./../models/user-model");

const signToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password, passwordConfirm } = req.body;

    console.log(req.body);
    const newUser = await User.create({
      name,
      email,
      password,
      passwordConfirm,
    }).catch((err) => {
      return next(new HttpError("Could not create user", 500));
    });

    const token = await signToken(newUser._id);

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

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new HttpError("Please Enter Email and Password!", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new HttpError("Incorrect Email or Password", 401));
    }

    const token = signToken(user._id);
    res.status(200).json({
      status: "success",
      token,
    });
  } catch (err) {
    console.log(err);
    const error = new HttpError(err, 500);
    return next(error);
  }
};

exports.protectRoute = async (req, res, next) => {
  try {
    let token;

    // Check if the correct headers are sent
    if (
      !req.headers.authorization &&
      !req.headers.authorization.startsWith("Bearer")
    ) {
      return next(new HttpError("You are not logged in", 401));
    } else {
      token = req.headers.authorization.split(" ")[1];
    }

    // Verify token
    const decodedToken = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET
    );

    console.log(decodedToken);
    // Check if user still exist
    const existingUser = await User.findById(decodedToken.id);
    console.log(`existingUser: ${existingUser}`);
    if (!existingUser) {
      return next(
        new HttpError("The User belonging to this token no longer exist", 401)
      );
    }

    // Check if token is expired
    if (existingUser.changedPasswordAfter(decodedToken.iat)) {
      return next(
        new HttpError("User recently changed password. Please try again.", 401)
      );
    }

    req.user = existingUser;
    next();
  } catch (err) {
    console.log(err);
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new HttpError("You do not have permission to perform this action", 403)
      );
    }
    
    next();
  };
};
