const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const jwt = require("jsonwebtoken");
const authenticate = require("../middleware/authenticate");
require("../db/conn");
const User = require("../model/user");
router.post("/login", async (req, res) => {
  try {
    let token;
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "plz fill the data" });
    }
    const userLogin = await User.findOne({ username: username });
    console.log({ userLogin });
    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);
      token = await userLogin.generateAuthToken();
      console.log(token);
      res.cookie("token", token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true,
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-origin": "http://localhost:3000",
      });
      console.log({ isMatch });
      if (!isMatch) {
        res.status(400).json({ error: "Invalid Credentials" });
      } else {
        res.json({ message: "user Signin Successfully" });
      }
    } else {
      res.status(400).json({ error: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(422).json({ error: "Plz fill the field properly" });
  }
  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(422).json({ error: "Email already exist" });
    }
    const user = new User({ username, email, password });

    let response = await user.save();
    console.log({ response });
    res.status(201).json({ message: "user registered successfully" });
  } catch (error) {
    console.log(error);
  }
});

router.get("/contact", authenticate, (req, res) => {});

module.exports = router;
