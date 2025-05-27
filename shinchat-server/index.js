require("dotenv").config();
const db = require("./db");

const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 4000;

const authRoutes = require("./src/routes/authRoutes");

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => res.send("Server is running"));

app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
