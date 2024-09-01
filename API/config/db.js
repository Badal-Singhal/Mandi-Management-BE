const mysql=require('mysql');


const conn=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'Badal@123',
    database:'mandi'
})

conn.connect((err)=>{
    if(err) throw err
    console.log("database connected");
})

module.exports=conn;