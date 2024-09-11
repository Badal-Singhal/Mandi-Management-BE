const mysql=require('mysql');

//local
const conn=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'Badal@123',
    database:'mandi'
})

//production
// const conn=mysql.createConnection({
//     host:'127.0.0.1',
//     user:'root',
//     password:'Aaditya@123',
//     database:'mandi'
// })

conn.connect((err)=>{
    if(err) throw err
    console.log("database connected");
})

module.exports=conn;