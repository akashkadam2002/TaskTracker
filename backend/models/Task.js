const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["incomplete", "complete"],
    default: "incomplete"
  },
  completedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true 
});

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
