import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
let tasks = [];
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://task-frontend-six-sepia.vercel.app",
    ],
  })
);

app.post("/api/tasks", (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || title.trim() == "") {
      return res.status(400).json({ error: "Title is required" });
    }

    let newTask = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description || undefined,
      completed: false,
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Error creating new Task:", error);
    res.status(500).json({ error: "Failed to create new Task" });
  }
});

app.get("/api/tasks", (req, res) => {
  try {
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

app.patch("/api/tasks/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    const task = tasks.find((t) => t.id === id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    // Assigns to object reference
    task.completed = completed;

    res.json(task);
  } catch (error) {
    console.error("Error updating Task:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
});

async function start() {
  app.listen(PORT, () => {
    console.log(`Node.js API server running on port ${PORT}`);
  });
}

start();
