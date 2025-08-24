const mongoose = require("mongoose");
require("dotenv").config();
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Mongoose Connected Successfully");
  } catch (err) {
    console.error("MongoDB Connection Error:", err.message);
  }
};

module.exports = connectDB;
