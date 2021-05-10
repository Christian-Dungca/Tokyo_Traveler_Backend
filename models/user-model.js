const crypto = require("crypto");
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
  role: {
    type: String,
    enum: ["user", "author", "admin"],
    default: "user",
  },
  createdAt: {
    type: Date,
    require: false,
    default: Date.now(),
  },
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
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

// Document Middleware - points to current document
UserSchema.pre("save", async function (next) {
  // Only run this function if the password was modified
  if (!this.isModified("password")) return next();

  this.password = await bycrypt.hash(this.password, 12);

  // Delete the passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

UserSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Query Middleware - points to current query
UserSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

// Model Methods
UserSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangeAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangeAt.getTime() / 1000,
      10
    );
    return JWTTimeStamp < changedTimeStamp;
  }

  return false;
};

UserSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bycrypt.compare(candidatePassword, userPassword);
};

UserSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  // console.log({ resetToken }, this.passwordResetToken);

  return resetToken;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
