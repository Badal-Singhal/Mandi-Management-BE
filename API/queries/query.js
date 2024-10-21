let register = `INSERT INTO master_data_user ("userName", password, "firmName", "firmAddress", "mobileNumber", "gstNumber", "panNumber", "panPhoto")
VALUES (<<userName>>, <<password>>, <<firmName>>, <<firmAddress>>, <<mobileNumber>>, <<gstNumber>>, <<panNumber>>, <<panPhoto>>)`;

let login=`Select * from master_data_user where "userName"=<<userName>>`;

let createReceipt=`INSERT INTO master_data_receipt (user_id, "supplierName", dheri, rate, lab, amount, "finalRate", weight, remarks, photo_path,parchi_no) 
VALUES (<<user_id>>,<<firmName>>,<<dheri>>,<<rate>>,<<lab>>,<<amount>>, <<finalRate>>, <<weight>>, <<remarks>>,<<photo_path>>,<<parchi_no>>)`;

let purchaseBookQuery=`Select * from master_data_receipt where user_id=<<user_id>>`;

let profieInfo=`Select "firmName", "firmAddress", "mobileNumber","gstNumber","panNumber","panPhoto","userName" from master_data_user where user_id=<<user_id>>`;

let checkGstNumberQuery=`Select * from master_data_user where "gstNumber"=<<gstNumber>>`;

module.exports={register,login,createReceipt,purchaseBookQuery,profieInfo,checkGstNumberQuery};