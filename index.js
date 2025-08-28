const app = require("./app");
const connectDB = require("./config/db");
require("dotenv").config();

connectDB();

module.exports = app;
