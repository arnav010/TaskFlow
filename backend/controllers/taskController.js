const Task = require("../models/Task");

async function getTasks(req, res) {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Could not get tasks" });
  }
}

async function createTask(req, res) {
  try {
    const title = req.body.title;
    const description = req.body.description;
    const status = req.body.status;

    if (!title) {
      return res.status(400).json({ message: "Task title is required" });
    }

    const newTask = new Task({
      title: title,
      description: description,
      status: status
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ message: "Could not create task" });
  }
}

async function deleteTask(req, res) {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Could not delete task" });
  }
}

module.exports = {
  getTasks,
  createTask,
  deleteTask
};
