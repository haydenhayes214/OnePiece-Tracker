/* *require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))My Project 71897On
  .catch(err => console.log(err));

// Define schema & model
const progressSchema = new mongoose.Schema({
  userId: String,
  type: String, // "anime" or "manga"
  progress: Number,
  targetDate: String
});

const Progress = mongoose.model("Progress", progressSchema);

// API endpoints
app.get("/progress/:userId", async (req, res) => {
  const { userId } = req.params;
  const data = await Progress.find({ userId });
  res.json(data);
});

app.post("/progress", async (req, res) => {
  const { userId, type, progress, targetDate } = req.body;

  const updated = await Progress.findOneAndUpdate(
    { userId, type },
    { progress, targetDate },
    { upsert: true, new: true }
  );

  res.json(updated);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
*/
