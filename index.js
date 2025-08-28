// // 


// const app = require("./app");
// const connectDB = require("./config/db");
// const serverless = require("serverless-http");
// require("dotenv").config();

// connectDB();

// module.exports = serverless(app);

// const express = require("express");
// const app = express();

// // Middleware
// app.use(express.json());

// // Routes
// app.get("/", (req, res) => {
//   res.send("API is working 🎉");
// });

// app.get("/api/hello", (req, res) => {
//   res.json({ message: "Hello from Vercel!" });
// });

// module.exports = app;


const app = require("./app"); // استيراد app اللي فيه كل الـ routes

module.exports = app; // تصديره علشان Vercel يشتغل بيه
