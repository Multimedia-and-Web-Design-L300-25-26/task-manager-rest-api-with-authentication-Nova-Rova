import express from "express";
import Task from "../models/Task.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply auth middleware
router.use(authMiddleware);

// POST /api/tasks
router.post("/", async (req, res) => {
  // - Create task
  // - Attach owner = req.user._id'
  
  const task = new Task({
    ...req.body,
    owner: req.user._id
  });
  await task.save();
  res.status(201).json(task);
});

// GET /api/tasks
router.get("/", async (req, res) => {
  // - Return only tasks belonging to req.user
  const tasks = await Task.find({ owner: req.user._id });
  res.json(tasks);
});

// DELETE /api/tasks/:id
router.delete("/:id", async (req, res) => {
  // - Check ownership
  // - Delete task
  const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }
  res.json({ message: "Task deleted" });
});

export default router;