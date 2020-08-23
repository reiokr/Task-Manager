const express = require("express");
const Task = require("../models/task");

const router = new express.Router();

// create new task
router.post("/tasks", async (req, res) => {
  const task = new Task(req.body);
  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e.message);
  }
  task;
});
// get all tasks
router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({});
    const countCompleted = await Task.countDocuments({ completed: true });
    const countUnCompleted = await Task.countDocuments({ completed: false });
    res.send({ tasks, countCompleted, countUnCompleted });
  } catch (e) {
    res.status(500).send();
  }
});
// get task by id
router.get("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});
// update task
router.patch("/tasks/:id", async (req, res) => {
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
    const task = await Task.findById(req.params.id);
    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();

    // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });

    if (!task) return res.status(404).send({ error: "Task not found" });
    res.send(task);
  } catch (e) {
    res.status(400).send(e.message);
  }
});
// delete task by id
router.delete("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    const count = await Task.countDocuments({ completed: false });
    if (!task) return res.status(404).send({ error: "Task not found" });
    res.send({ task, message: `Task deleted!`, unCompletedTasks: count });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

module.exports = router;
