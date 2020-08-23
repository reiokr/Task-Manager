const express = require("express");
const Task = require("../models/task");
const auth = require("../middleware/auth");
const router = new express.Router();

// create new task
router.post("/tasks", auth, async (req, res) => {
  // const task = new Task(req.body);
  const task = new Task({
    ...req.body,
    author: req.user._id,
  });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e.message);
  }
  task;
});

// get all tasks
router.get("/tasks", auth, async (req, res) => {
  try {
    // const tasks = await Task.find({author: req.user._id});
    // res.send(tasks)
    await req.user.populate('tasks').execPopulate()
    res.send(req.user.tasks)
  } catch (e) {
    res.status(500).send();
  }
});

// get task by id
router.get("/tasks/:id",auth, async (req, res) => {
  const _id = req.params.id
  try {
    const task = await Task.findOne({
      _id,
      author: req.user._id,
    });
    if (!task) return res.status(404).send();
    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});
// update task
router.patch("/tasks/:id",auth, async (req, res) => {
  // check valid properties
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });
  if (!isValidOperation) {
    return res.status(400).send({
      error: "Invalid Updates!",
    });
  }
  try {
    const task = await Task.findOne({
      _id:req.params.id,
      author: req.user._id,
    });
    if (!task) return res.status(404).send({ error: "Task not found" });
    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();
    res.send(task);
  } catch (e) {
    res.status(400).send(e.message);
  }
});
// delete task by id
router.delete("/tasks/:id",auth, async (req, res) => {
  try {
    const task = await Task.findOne({ 
      _id: req.params.id,
      author: req.user._id,
    });
    
    if (!task) return res.status(404).send({ error: "Task not found" });
    task.delete();
    res.send({ task, message: `Task deleted!`});
  } catch (e) {
    res.status(400).send(e.message);
  }
});

module.exports = router;
