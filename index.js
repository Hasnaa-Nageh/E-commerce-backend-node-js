// 


const app = require("./app");
const connectDB = require("./config/db");
const serverless = require("serverless-http");
require("dotenv").config();

connectDB();

module.exports = serverless(app);
