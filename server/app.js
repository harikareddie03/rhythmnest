const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const multer = require("multer");
const connectDB = require("./db");
const songRoutes = require("./routes/songRoutes")
const cookieParser = require("cookie-parser")

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
app.use(cookieParser())
connectDB();

app.use(cors(
  {
    origin: "http://localhost:5173",
    methods: "GET, POST, PUT, DELETE, OPTIONS",
    allowedHeaders: "Content-Type, Authorization, Cache-Control",
    credentials: true,
  }
));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = file.mimetype.startsWith("image/") ? "artistPhotos" : "songs";
    cb(null, `uploads/${folder}`);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });
app.get("/profile", (req, res) => {
  res.status(200).json({ success: true, message: "Profile fetched successfully" });
});

app.use("/api/user", require("./routes/user"));
app.use("/api/playlist", require("./routes/playlist"));
app.use("/api/songs", songRoutes);
app.listen(PORT, () => {
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
});
