const { names } = require('debug');
var mysql = require('mysql')
var connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'Saini@6553',
  database: 'mypersonal'
})

connection.connect()
// .then(function(resp){
//   console.log(`Successfull Connected With MySql Server then Success`)
//   }).catch(function(err){
//   console.log("Error")
//   })

module.exports= connection;
let id=4;
let name='raja';
console.log("Successfull Connected With MySql Server")

// connection.query('SELECT * from client where id = ? or name = ?',[id,name], function (err, rows, fields) {
//   if (err) throw err
//   console.log(JSON.stringify(rows));

//   console.log(JSON.parse(JSON.stringify(rows)))
// })







//require('dotenv').config();
// const { createPool } = require('mysql')
// const pool = createPool({
//   host: "127.0.0.1",
//   user: "root",
//   password: "yuvika96",
//   database: "mypers
//   connectionLimit: 10
// })
// pool.query(`select * from client`, function(err, result, fields) {
//   if (err) {
//       return console.log(err);
//   }
//   return console.log(result);
// })
//root@127.0.0.1:3306
