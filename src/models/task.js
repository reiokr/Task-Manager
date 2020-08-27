const mongoose = require("mongoose");
const router = require("../routers/user");

const taskSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (value.length < 3) throw new Error("Must be at least 3 characters");
      },
    },
    completed: { type: Boolean, default: false },
    // option ref is reference to User model
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
