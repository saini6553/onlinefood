//var MongoClient = require('mongodb').MongoClient
const MongoClient = require('mongoose')
 

module.exports = MongoClient.connect('mongodb://localhost:27017/mypersonal', function (err, db) {
  if (err) throw err
  console.log(`MONGODB Has Successfully Connected`)

  //let a = db.collection('mongoMy').find();
  //console.log(a); 

  let a = db.collection("mongoMy").findOne({}, function(err, result) {
    if (err) throw err;
   // console.log(result);
    db.close();
  });


})


