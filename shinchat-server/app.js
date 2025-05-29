require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();

const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => res.send("Server is running"));
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

module.exports = app;
