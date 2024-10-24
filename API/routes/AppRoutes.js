const express = require("express");
const {Register, Login, CreateReceipt, PurchaseBook, ProfieInfo, SentPdf, ShowParchi, CheckGstNumber} = require("../models/credential");
const router = express.Router();
const multer = require("multer");
const { Authenticate } = require("../Authentication/jwt");
const upload=multer();



const pan_card_photo = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("Hellloooooooo");
    cb(null, "./uploads/pan_card");
  },
  filename: function (req, file, cb) {
    
    const prefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    let pan_path=prefix + "_" + file.originalname;
    console.log(pan_path);
    cb(null, pan_path);
  },
});

// const dheri_photo = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./uploads/dheri_photo");
//   },
//   filename: function (req, file, cb) {
    
//     const prefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     let dheri_path=prefix + "_" + file.originalname;
//     cb(null, dheri_path);
//   },
// });

const pan_card_photo_upload = multer({ storage: pan_card_photo });
// const dheri_photo_upload = multer({ storage: dheri_photo });

router.post("/register", pan_card_photo_upload.single("pan_photo"), Register);
router.post("/checkGstNumber",CheckGstNumber)
router.post("/login",upload.none(), Login);
router.post("/CreateReceipt",Authenticate,CreateReceipt);
router.post("/purchaseBook",Authenticate,PurchaseBook);
router.post("/showParchi",Authenticate,ShowParchi);
router.post("/profileInfo",Authenticate,ProfieInfo);
router.post("/sentPdf",Authenticate,SentPdf);

module.exports =router;
