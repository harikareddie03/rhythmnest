const express = require("express");
const cors = require("cors");
const app = express();
const punycode = require("punycode/");
const userRoute = require("./routes/user")
require("dotenv").config();
const PORT = 8080;
// require("./db");

const connectDB = require("./db");
connectDB();


app.use(express.json());
app.use(cors());

app.use("/api/user", userRoute);
app.use("/api/playlist", require("./routes/playlist"));

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
