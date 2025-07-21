const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const bookRoutes = require("./routes/book");
const requestRoutes = require("./routes/request");


const app = express();

// app.use(cors());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend running.");
});

app.use("/api", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/requests", requestRoutes);

app.get("/api/test", (req, res) => {
    res.json({ message: "Backend working!" });
})

connectDB();

PORT = process.env.PORT || 3000;
app.listen(PORT, (req, res) => {
    console.log(`Server running on port ${PORT}`);
})
