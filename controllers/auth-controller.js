const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");
const sendEmail = require("../util/email");
const User = require("./../models/user-model");

const signToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};

const createSendToken = async (user, statusCode, res) => {
  const token = await signToken(user._id);

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user: user,
    },
  });
};

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password, passwordConfirm } = req.body;

    // console.log(req.body);
    const newUser = await User.create({
      name,
      email,
      password,
      passwordConfirm,
    }).catch((err) => {
      return next(new HttpError("Could not create user", 500));
    });

    createSendToken(newUser, 201, res);
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

    createSendToken(user, 200, res);
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
      !req.headers.authorization ||
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

    // console.log(decodedToken);
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

exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(
        new HttpError("There is no user with that email address", 404)
      );
    }
    // generate random token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // send it to user's email
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/users/resetPassword/${resetToken}}`;

    const message = ` Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email`;

    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 minutes)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    console.log(err);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new HttpError(
        "There was an error sending the email. Try again later!",
        500
      )
    );
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    // Get user based on the token
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    // Set the new password if token is not expired and there is a user
    if (!user) {
      return next(new HttpError("Token is invalid or has expired", 400));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Update changePasswordAt property for the user

    // Log the user in, send JWT
    createSendToken(user, 200, res);
  } catch (err) {
    return next(new HttpError(err, 400));
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    // Get user from collection
    const user = await User.findById(req.user.id).select("+password");

    // Check if Posted current password is correct
    if (
      !(await user.correctPassword(req.body.passwordCurrent, user.password))
    ) {
      return next(new HttpError("Your current password is wrong.", 401));
    }

    // If password is correct, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    // Log user in, send JWT
    createSendToken(user, 200, res);
  } catch (err) {
    return next(
      new HttpError("There was an error updating your password", 500)
    );
  }
};
