const express = require('express');

const userController = require('../controllers/user-controller');

const router = express.Router();

router.post('/signup', userController.SignUpUser);

module.exports = router;