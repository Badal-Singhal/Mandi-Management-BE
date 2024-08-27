var jwt = require("jsonwebtoken");

var privateKey = "fhgfhdgfjhjdfh";

const Authenticate = (req, res,next) => {
  console.log(req.headers["authorization"]);

  try {
    const tokenReceived = req.headers["authorization"].split(" ")[1];
    jwt.verify(tokenReceived, privateKey, (err, decoded) => {
      if (err) {
        res.status(404).json({
          message: "Token is corrupted",
        });
      }
      if (decoded) {
        next();
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { privateKey, Authenticate };
