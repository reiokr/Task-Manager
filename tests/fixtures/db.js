const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../../src/models/user");
const Task = require("../../src/models/task");

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: "Reio",
  email: "reio@mail.com",
  password: "reio123",
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
    },
  ],
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  name: "Jenna",
  email: "jenna@mail.com",
  password: "jenna123",
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET),
    },
  ],
};

const task1 = {
  _id: new mongoose.Types.ObjectId(),
  description: "Task one",
  completed: false,
  author: userOne._id,
};
const task2 = {
  _id: new mongoose.Types.ObjectId(),
  description: "Task two",
  completed: true,
  author: userOne._id,
};
const task3 = {
  _id: new mongoose.Types.ObjectId(),
  description: "Task for user two",
  completed: false,
  author: userTwo._id,
};

// delete tasks and users from database before new test and save curenent test tasks and users
const setupDatabase = async () => {
  await User.deleteMany();
  await Task.deleteMany();
  await new User(userOne).save();
  await new User(userTwo).save();
  await new Task(task1).save();
  await new Task(task2).save();
  await new Task(task3).save();
};

module.exports = {
  userOneId,
  userOne,
  userTwoId,
  userTwo,
  task1,
  task2,
  task3,
  setupDatabase,
};
