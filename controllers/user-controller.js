const { request } = require("express");

const DUMMY_USERS = [
  { name: "christian", email: "christian@gmail.com", password: "12345" },
  { name: "jake", email: "jake@gmail.com", password: "12345" },
  { name: "moon", email: "moon@gmail.com", password: "12345" },
];

const signUpUser = (req, res, next) => {
  const { name, email, password } = req.body;
  const newUser = { name, email, password };

  res.json({ data: newUser });
};

exports.signUpUser = signUpUser;
