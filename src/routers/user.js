const express = require("express");
const User = require("../models/user");

const router = new express.Router();

// get user by name
router.get("/user", async (req, res) => {
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
    res.status(201).send(user);
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
    res.send(user);
    await set.cookie(user.password);
    await sessionStorage.setItem('user', user.password)
  } catch (e) {
    res.status(404).send(e.message);
  }
});

//get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (e) {
    res.status(500).send();
  }
});
// get user by id
router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.send(user);
  } catch (e) {
    res.status(500).send();
  }
});
// update user by id
router.patch("/users/:id", async (req, res) => {
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
    const user = await User.findById(req.params.id);
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();

    // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });

    if (!user) return res.status(404).send();
    res.send(user);
  } catch (e) {
    res.status(400).send(e.message);
  }
});
// delete user by id
router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).send({ error: "User not found" });
    res.send({ message: `User deleted!`, user });
  } catch (e) {
    res.status(404).send(e.message);
  }
});

module.exports = router;
