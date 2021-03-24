const express = require("express");

const userController = require("../controllers/user-controller");
const authController = require("../controllers/auth-controller");
const { route } = require("./article-routes");

const router = express.Router();

router.get("/", userController.getAllUsers);

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.patch(
  "/updateMyPassword",
  authController.protectRoute,
  authController.updatePassword
);

router.patch("/updateMe", authController.protectRoute, userController.updateMe);
router.delete(
  "/deleteMe",
  authController.protectRoute,
  userController.deleteMe
);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

module.exports = router;
