const express = require("express");
const mongoose = require("mongoose");
const { z } = require("zod");

const app = express();

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Successfully connected to MONGO DB!");
  } catch (err) {
    console.log("Connection Error: ", err.message);
  }
}

app.use(express.json());

const todoSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    completed: Boolean,
  },
  { timestamps: true },
);

const Todo = mongoose.model("Todo", todoSchema);

const checkSchema = z
  .object({
    title: z.string().trim().min(3),
    description: z.string().optional(),
    completed: z.boolean().default(false),
  })
  .strict();

app.get("/todos", async (req, res) => {
  try {
    let result = await Todo.find();
    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: "Database Error",
      error: err.message,
    });
  }
});

app.post("/todos", async (req, res) => {
  const result = checkSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({
      message: "Validation Error",
      errors: result.error.issues,
    });
    return;
  }

  try {
    const newTodo = await Todo.create(result.data);
    res.status(201).json({
      message: "Successfully created todo!",
      todo: newTodo,
    });
  } catch (err) {
    res.status(500).json({
      message: "Database Error",
      error: err.message,
    });
  }
});

app.patch("/todos/:id/toggle", async (req, res) => {
  const index = req.params.id;

  try {
    const todo = await Todo.findById(index);

    if (!todo) {
      res.status(404).json({
        message: "Todo not found!",
      });
      return;
    }

    todo.completed = !todo.completed;
    await todo.save();

    res.json({
      message: "Successfully toggled todo status",
      todo: todo,
    });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({
        message: "Invalid Todo ID format",
      });
    }

    res.status(500).json({
      message: "Database Error",
      error: err.message,
    });
  }
});

connectDB();
app.listen(3000, () => {
  console.log("Listening to port 3000...");
});
