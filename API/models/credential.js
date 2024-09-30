const queries = require("../queries/query");
const sql = require("mysql");
const { pan_path } = require("../routes/AppRoutes");
const conn = require("../config/db");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const { privateKey } = require("../Authentication/jwt");
// const fs = require("fs");
const qs = require('qs');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const fs2 = require('fs').promises;

const Register = async (req, res) => {
  try {
    let {
      userName,
      password,
      firmName,
      firmAddress,
      mobileNumber,
      gstNumber,
      panNumber,
    } = req.body;

    let file = req.file;
    password = await new Promise((resolve, reject) => {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) reject(err);
        resolve(hash);
      });
    });

    console.log(password);

    let registerQuery = queries.register;

    registerQuery = registerQuery.replace("<<userName>>", sql.escape(userName));
    registerQuery = registerQuery.replace("<<password>>", sql.escape(password));
    registerQuery = registerQuery.replace("<<firmName>>", sql.escape(firmName));
    registerQuery = registerQuery.replace(
      "<<firmAddress>>",
      sql.escape(firmAddress)
    );
    registerQuery = registerQuery.replace(
      "<<mobileNumber>>",
      sql.escape(mobileNumber)
    );
    registerQuery = registerQuery.replace(
      "<<gstNumber>>",
      sql.escape(gstNumber)
    );
    registerQuery = registerQuery.replace(
      "<<panNumber>>",
      sql.escape(panNumber)
    );
    registerQuery = registerQuery.replace(
      "<<panPhoto>>",
      sql.escape(file.path)
    );

    console.log(registerQuery);

    conn.query(registerQuery, (err, result) => {
      if (err) {
        console.error("Error:", err);
        res.status(500).json({ error: "Internal server error" });
      } else {
        res.status(200).json({
          message: "Success",
          data: {
            userName,
            password,
            firmName,
            firmAddress,
            mobileNumber,
            gstNumber,
            panNumber,
            file,
          },
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const Login = (req, res) => {
  try {
    let { userName, password } = req.body;
    console.log(req.body.userName);

    let loginQuery = queries.login;
    loginQuery = loginQuery.replace("<<userName>>", sql.escape(userName));
    console.log(loginQuery);
    conn.query(loginQuery, (error, result) => {
      if (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal server error" });
      } else {
        if (result.length > 0) {
          bcrypt.compare(password, result[0].password, (err, resu) => {
            if (err) {
              console.error("Error:", err);
              res.status(500).json({ error: "Internal server error" });
            }
            if (resu === true) {
              var token = jwt.sign(userName, privateKey);
              res.status(200).json({
                message: "Login Successfully",
                data: {
                  token,
                  user_id: result[0].user_id,
                },
                resu,
              });
            } else {
              res.status(200).json({
                message: "Incorrect Password",
                resu,
              });
            }
          });
        } else {
          res.status(200).json({
            message: "UserName Not Exist",
          });
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const CreateReceipt = (req, res) => {
  console.log(req);
  try {
    let { alldheri, user_id,parchi_no } = req.body;

    alldheri.map((val, index) => {
      let {
        firmName,
        dheri,
        rate,
        lab,
        amount,
        finalRate,
        weight,
        remarks,
        photo,
      } = val;

      const base64Data = photo.replace(/^data:image\/\w+;base64,/, "");

      const buffer = Buffer.from(base64Data, "base64");
      const filename = Date.now() + "_receipt.png";

      if (!fs.existsSync(`uploads/dheri_photo/${user_id}`)) {
        fs.mkdirSync(`uploads/dheri_photo/${user_id}`, { recursive: true });
        console.log('Folder created successfully.');
      }

      fs.writeFile(`uploads/dheri_photo/${user_id}/` + filename, buffer, (err) => {
        if (err) {
          console.error("Error saving file:", err);
          return res.status(500).json({ error: "Error saving file" });
        }
      });

      // Proceed with your database insertion or other operations
      let createReceiptQuery = queries.createReceipt;

      // Replace placeholders in query with values
      createReceiptQuery = createReceiptQuery.replace(
        "<<user_id>>",
        sql.escape(user_id)
      );
      createReceiptQuery = createReceiptQuery.replace(
        "<<firmName>>",
        sql.escape(firmName)
      );
      createReceiptQuery = createReceiptQuery.replace(
        "<<dheri>>",
        sql.escape(dheri)
      );
      createReceiptQuery = createReceiptQuery.replace(
        "<<rate>>",
        sql.escape(rate)
      );
      createReceiptQuery = createReceiptQuery.replace(
        "<<lab>>",
        sql.escape(lab)
      );
      createReceiptQuery = createReceiptQuery.replace(
        "<<amount>>",
        sql.escape(amount)
      );
      createReceiptQuery = createReceiptQuery.replace(
        "<<finalRate>>",
        sql.escape(finalRate)
      );
      createReceiptQuery = createReceiptQuery.replace(
        "<<weight>>",
        sql.escape(weight)
      );
      createReceiptQuery = createReceiptQuery.replace(
        "<<remarks>>",
        sql.escape(remarks)
      );
      createReceiptQuery = createReceiptQuery.replace(
        "<<photo_path>>",
        sql.escape(`uploads/dheri_photo/${user_id}/` + filename)
      );
      createReceiptQuery = createReceiptQuery.replace(
        "<<parchi_no>>",
        sql.escape(parchi_no)
      );

      console.log(createReceiptQuery);

      // Execute SQL query
      conn.query(createReceiptQuery, (error, result) => {
        if (error) {
          console.error("Error:", error);
          return res.status(500).json({ error: "Internal server error" });
        }

        if (index === alldheri.length - 1) {
          res.status(200).json({
            message: "Success",
            data: {
              user_id,
              firmName,
              dheri,
              rate,
              weight,
              remarks,
              file: filename, 
            },
          });
        }
      });
    });
  } catch (error) {
    console.error("Catch Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

const PurchaseBook=(req,res)=>{
  try {
    let {user_id}=req.body
    let purchaseBookQuery=queries.purchaseBookQuery
    purchaseBookQuery = purchaseBookQuery.replace(
      "<<user_id>>",
      sql.escape(user_id)
    );

    conn.query(purchaseBookQuery,(error,result)=>{
      if (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal server error" });
      }else{
        res.status(200).json({
          data: result
        });
      }
    })

  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

const ShowParchi = async (req, res) => {
  try {
    const { photo_path } = req.body;

  
    if (!photo_path) {
      return res.status(400).json({ error: "Photo path is required." });
    }

    console.log(photo_path);

    
    const imagePath = path.join('./', photo_path);
    console.log("Image Path:", imagePath); // Log the image path for debugging

    // Read the image file asynchronously
    const imageBuffer = await fs2.readFile(imagePath);
    const base64Image = imageBuffer.toString('base64');

    res.status(200).json({
      data: base64Image,
    });
  } catch (error) {
    console.error(error);
    // Check if error is due to file not found
    if (error.code === 'ENOENT') {
      return res.status(404).send("File not found");
    }
    res.status(500).send("Internal Server Error");
  }
};

const ProfieInfo=(req,res)=>{
  try {
    let {user_id}=req.body
    let profieInfoQuery=queries.profieInfo
    profieInfoQuery = profieInfoQuery.replace(
      "<<user_id>>",
      sql.escape(user_id)
    );

    conn.query(profieInfoQuery,(error,result)=>{
      if (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal server error" });
      }else{
        res.status(200).json({
          data: result
        });
      }
    })

  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

const SentPdf = async (req, res) => {
  try {
    console.log("Hello world");

    // Extract data from request body
    const { data } = req.body;

    // Get the Base64 string (assuming data is already in Base64 format)
    const base64String = data.split(',')[1];
    console.log(base64String);

    // Prepare the data to be sent
    const postData = qs.stringify({
      "token": "ig1cy8o0a7dl4k1l",
      "to": "+919784671989",
      "filename": "invoice.pdf",
      "document": base64String,
      "caption": "By Anupgarh Enterprise"
    });

    // Send the POST request using axios
    const response = await axios({
      method: 'post',
      url: 'https://api.ultramsg.com/instance92601/messages/document',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: postData
    });

    // Handle the response
    console.log('Response:', response.data);
    res.status(200).send('PDF sent successfully');

  } catch (error) {
    console.error('Error sending PDF:', error.message);
    res.status(500).send('Error sending PDF');
  }
};

module.exports = { Register, Login, CreateReceipt,PurchaseBook, ProfieInfo, SentPdf, ShowParchi };
