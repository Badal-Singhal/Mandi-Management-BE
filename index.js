require("dotenv").config();
const express = require("express");
const router = require("./API/routes/AppRoutes");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// Use built-in middleware for JSON and URL-encoded data
app.use(express.json({ limit: '50mb' })); // Set limit for JSON body
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Set limit for URL-encoded body

// Use the router for your API routes
app.use("/mandi", router);

// Start the server
app.listen(port, () => {
  console.log("Server is listening on port " + port);
});
