const express = require("express");
const router = require("./API/routes/AppRoutes");
const app = express();
const port = 8080;
var cors = require("cors");

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/mandi", router);

app.listen(port, () => {
  console.log("server is listening on port " + port);
});
