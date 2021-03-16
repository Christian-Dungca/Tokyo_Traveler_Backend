const mongoose = require("mongoose");
const bycrypt = require("bcryptjs");

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
    select: false,
  },
  passwordConfirm: {
    type: String,
    require: [true, "Please confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords do not match",
    },
  },
});

UserSchema.pre("save", async function (next) {
  // Only run this function if the password was modified
  if (!this.isModified("password")) return next();

  this.password = await bycrypt.hash(this.password, 12);

  // Delete the passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

UserSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bycrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
