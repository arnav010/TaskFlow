const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");

const boardRoutes = require("./routes/boardRoutes");
const taskRoutes = require("./routes/taskRoutes");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());


app.use(express.static(path.join(__dirname, "../frontend")));

app.use("/boards", boardRoutes);
app.use("/tasks", taskRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, function () {
  console.log(`TaskFlow server is running on port ${PORT}`);
});
