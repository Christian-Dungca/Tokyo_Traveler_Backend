const express = require("express");

const userController = require("../controllers/user-controller");
const authController = require("../controllers/auth-controller");

const router = express.Router();

router.post("/signup", authController.signup);

module.exports = router;
