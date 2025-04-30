const Task = require("../models/Task");
const { validateObjectId } = require("../utils/validation");

// Get all tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.status(200).json({ tasks, status: true, msg: "Tasks found successfully." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
};

// Get a single task by ID
exports.getTask = async (req, res) => {
  try {
    if (!validateObjectId(req.params.taskId)) {
      return res.status(400).json({ status: false, msg: "Task ID not valid" });
    }

    const task = await Task.findOne({ user: req.user.id, _id: req.params.taskId });
    if (!task) {
      return res.status(404).json({ status: false, msg: "No task found." });
    }

    res.status(200).json({ task, status: true, msg: "Task found successfully." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
};

// Create a new task
exports.postTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    if (!title || !description) {
      return res.status(400).json({ status: false, msg: "Title and description are required." });
    }

    const completedAt = status === "complete" ? new Date() : null;

    const task = await Task.create({
      user: req.user.id,
      title,
      description,
      status: status || "incomplete",
      completedAt
    });

    res.status(201).json({ task, status: true, msg: "Task created successfully." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
};

// Update a task
exports.putTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    if (!title || !description || !status) {
      return res.status(400).json({ status: false, msg: "Title, description, and status are required." });
    }

    if (!validateObjectId(req.params.taskId)) {
      return res.status(400).json({ status: false, msg: "Task ID not valid" });
    }

    let task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ status: false, msg: "Task with given ID not found" });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ status: false, msg: "Unauthorized to update this task" });
    }

    task.title = title;
    task.description = description;

    if (task.status !== status) {
      task.status = status;
      task.completedAt = status === "complete" ? new Date() : null;
    }

    await task.save();
    res.status(200).json({ task, status: true, msg: "Task updated successfully." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    if (!validateObjectId(req.params.taskId)) {
      return res.status(400).json({ status: false, msg: "Task ID not valid" });
    }

    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ status: false, msg: "Task with given ID not found" });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ status: false, msg: "Unauthorized to delete this task" });
    }

    await Task.findByIdAndDelete(req.params.taskId);
    res.status(200).json({ status: true, msg: "Task deleted successfully." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
};
