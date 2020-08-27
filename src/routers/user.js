const express = require("express");
const multer = require("multer"); // help routing files
const sharp = require("sharp"); //help modifying images
const auth = require("../middleware/auth");
const User = require("../models/user");
const {sendWelcomeEmail, sendCancelationEmail} = require("../emails/account")

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
    sendWelcomeEmail(user.email, user.name, token);
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
    res.status(500).send("Server error");
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
    const user = await req.user.remove();
    res.send({ message: `User deleted!`, user });
    sendCancelationEmail(user.email, user.name);
  } catch (e) {
    res.status(404).send(e.message);
  }
});
const upload = multer({
  limits: { fileSize: 1000000 },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(
        new Error("Allowed only files with jpg, jpeg, gif or png extension")
      );
    }
    cb(undefined, true);
  },
});

// upload user avatar
router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    // resizing and saving avatar image with extension .png using sharp module
    const buffer = await sharp(req.file.buffer).resize(200).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send({ message: "avatar uploded" });
  },
  // send clean error message
  (err, req, res, next) => {
    res.status(400).send({
      error: err.message,
    });
  }
);

// delete avatar
router.delete("/users/me/avatar", auth, async (req, res) => {
  try {
    req.user.avatar = undefined; // undefined means remove avatar property
    await req.user.save(); // save user object without avatar
    res.send({ message: "avatar deleted" });
  } catch (e) {
    res.status(404).send(e.message);
  }
});

router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) {
      throw new Error("User or user avatar not found");
    }

    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send(e.message);
  }
});

module.exports = router;
