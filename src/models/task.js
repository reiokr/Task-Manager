const mongoose = require("mongoose");
const router = require("../routers/user");

const Task = mongoose.model("Task", {
  description: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      if (value.length <3) throw new Error("Must be at least 3 characters");
    },
  },
  completed: { type: Boolean, default: false },
});

const task = new Task({
  description: "Learn NodeJS",
  completed: true,
});

module.exports = Task;
