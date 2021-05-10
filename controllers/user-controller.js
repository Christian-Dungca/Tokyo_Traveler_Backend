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

exports.deleteMe = async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
};

exports.getAllUsers = async (req, res, next) => {
  const users = await User.find({});

  res.status(200).json({
    status: "success",
    data: {
      users: users,
    },
  });
};

exports.getUserById = async (req, res, next) => {
  try {
    const userId = req.params.uid;
    const user = await User.findById(userId);

    if (!user) {
      return next(new HttpError("No user with that ID", 400));
    }

    res.status(200).json({
      status: "success",
      user,
    });
  } catch (err) {
    console.log(err);
    return next(500, err);
  }
};
