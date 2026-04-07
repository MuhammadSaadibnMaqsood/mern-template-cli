const mongoose = require("mongoose");

const connectDb = async () => {
  const connString =
    process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mern_template_db";

  try {
    await mongoose.connect(connString);
    console.log("MongoDB Connected... 🍃");
  } catch (error) {
    // Fixed 'err' to 'error' to match the catch variable
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDb; // Don't forget to export!