const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const punycode = require("punycode/");
const userRoute = require("./routes/user")
require("dotenv").config();
const PORT = 8080;
// require("./db");

const connectDB = require("./db");
connectDB();

app.get("/profile", (req, res) => {
  res.status(200).json({ success: true, message: "Profile fetched successfully" });
});

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRoute);
app.use("/api/playlist", require("./routes/playlist"));



app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});

const songRoutes = require('./routes/songRoutes');
app.use('/api/songs', songRoutes);



