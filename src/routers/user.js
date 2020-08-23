const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");

const router = new express.Router();

// get user by name
router.get("/user", auth, async (req, res) => {
  if (!req.query.name) {
    return res.send({
      error: "User name must be provided",
    });
  }
  const nameInput = req.query.name;
  const firstLetter = nameInput.charAt(0).toUpperCase();
  const name = firstLetter + nameInput.slice(1);

  User.findOne({ name })
    .then((user) => {
      if (!user) res.send({ error: "No such user" });
      res.send(user);
    })
    .catch((e) => res.status(500).send(e.message));
});
// create new user
router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(404).send(e.message);
  }
});

// login request
router.post("/users/login", async (req, res) => {
  try {
    // using custom validation function findByCredentials to login
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

// logout user
router.post("/users/logout", auth, async (req, res) => {
  try {
    // filter current session token
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();

    res.send("User logged out from current session");
  } catch (e) {
    res.status(500).send();
  }
});

// logout user all sessions
router.post("/users/logoutall", auth, async (req, res) => {
  try {
    // remove all tokens from tokens array
    req.user.tokens = [];
    await req.user.save();
    res.send("User logged out from all sessions");
  } catch (e) {
    res.status(500).send();
  }
});

//get user data
router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

// list all users
router.get("/users", auth, async (req, res) => {
  try {
    const user = await User.find({});
    res.send(user);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

// update user
router.patch("/users/me", auth, async (req, res) => {
  // check valid properties
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid Updates!" });
  }
  try {
    const user = req.user;
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();
    res.send(user);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

// delete user
router.delete("/users/me", auth, async (req, res) => {
  try {
    // const user = await User.findByIdAndDelete(req.user._id);
    // if (!user) return res.status(404).send({ error: "User not found" });
    const user = await req.user.remove();
    res.send({ message: `User deleted!`, user });
  } catch (e) {
    res.status(404).send(e.message);
  }
});

module.exports = router;
