const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = async () => {
  try {
    console.log("🛠 Connecting to MongoDB...");
    console.log("🔗 MongoDB URI:", process.env.MONGO_URI); 
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
    return conn.connection.db; 
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1); 
  }
};

module.exports = connectDB;
