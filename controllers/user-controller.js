const User = require("../models/user-model");
const HttpError = require("../models/http-error");

const filterObj = (obj, ...allowedFeilds) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFeilds.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.updateMe = async (req, res, next) => {
  try {
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new HttpError(
          "This route is not for password updates. Please use /updateMyPassword",
          400
        )
      );
    }

    // Filter out unwanted field names that should not be updated
    const filteredBody = filterObj(req.body, "name", "email");
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      {
        new: true, // returns updated object
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    });
  } catch (err) {}
};
