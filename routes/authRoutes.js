const express = require("express");
const router = express.Router();
const passport = require("passport");
const passportConfig = require("../passport");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

//Handle signup
router.post("/signup", (req, res) => {
  const data = req.body;
  const { email, handle } = req.body;
  //check if user exists
  User.findOne({ email })
    .then((result) => {
      if (result) {
        res.status(400).json({ error: "Email already exists" });
      }
    })
    .catch((err) => {
      res.status(500).json(err);
    });
  //check if handle exists
  User.findOne({ handle })
    .then((result) => {
      if (result) {
        res.status(400).json({ error: "Handle already exists" });
      }
    })
    .catch((err) => {
      res.status(500).json(err);
    });

  //If email and handle isn't taken, create user
  User.create(data)
    .then((user) => {
      res.json(user);
    })
    .catch((err) => res.json(err));
});

//HANDLE LOGIN

//Function to sign token
const signToken = (id) => {
  return jwt.sign({ iss: "segun ajala", sub: id }, "social_hippo_app", {
    expiresIn: "2h",
  });
};

//Handle login route returns user when successful and Unauthorized when authentication fails
router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  (req, res) => {
    if (req.isAuthenticated()) {
      const { _id } = req.user;
      const token = signToken(_id);
      res.cookie("access_token", token, { httpOnly: true, sameSite: true });
      res.status(200).json(req.user);
    } 
  }
);

//Handles logouts
router.get("/logout", passport.authenticate("jwt", {session:false}),(req,res)=> {
    res.clearCookie("access_token")
    res.json("logged out")
})

module.exports = router;
