const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  name: { type: String, require: [true, "Please enter your name"] },
  email: {
    type: String,
    require: [true, "Please enter a valid email"],
    unique: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: "Please enter a valid email",
    },
  },
  photo: { type: String, require: false },
  password: {
    type: String,
    require: [true, "Please enter a password"],
    minLength: 6,
  },
  passwordConfirm: { type: String, require: [true, "Please confirm your password"] },
});

const User = mongoose.Model("User", UserSchema);

module.exports = User;
