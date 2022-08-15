var express = require('express');
let http = require('http');
const app = express();
const port = process.env.PORT || 3030;
const fs = require("fs")
const path = require("path")
var mysql = require('mysql')
const body = require('body-parser')
const multer = require('multer');
const session = require('express-session');
app.use(session({ secret: 'ssshhhhh', saveUninitialized: true, resave: true }));
const logger = require('morgan');
///app.use(logger('tiny'));
//const dbconn = require('/Users/Rahul Saini/Online_food_system/databaseconn/db')
var Task = require('./Models/appModel.js')

var id = 4;
const sqlco = require('./databaseconn/db')
const mongoco = ''// require('./databaseconn/mongodb')
///////=====const userdata = require('./UserCRUDData/Userdata')
///////=====const userdataobj = new userdata();
//app.use('./static',express.static(path.join(__dirname,'public')));
app.use(express.static('public'))  // for Start screen
//app.use(express.static('OnlineOrdersystem'))  // for Start screen
app.use(body.json())       // for API body 
app.use(body.urlencoded({ extended: false }))

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/views'));//Next Form for Window.open() of javascript
app.set('view engine', 'html');
console.log('==>',__dirname);

app.engine('html', require('ejs').renderFile);
const service = require("./Service/ClientService")
const serviceObj = new service();

app.get('/dashbord', (req, res) => {
  console.log(__dirname);
  //res.sendFile(path.join(__dirname, 'views/dashboard.html'));
  //res.sendFile(__dirname + "views/dashboard.html")
  //--res.redirect(path.join(__dirname + '/views/dashboard'));
  //res.redirect("/dashboard")
  //////res.render('dashboard')
})

 
//var setCurrentUser = require('./authorization/TokenUser');

app.get('/mydata/:id', (req, res) => {
  var obj = {};
  obj.id = 4;
  obj.name = 'raja';
  let arr = [{ id: '4', Name: 'raja', age: 29 }];
  console.log(Date.now())
  //req.logger.info('HII')
  //console.log(Task);
  //Task.getTaskById(obj)
  sqlco.query('SELECT * from client where id = ? and name = ? ', [obj.id, obj.name], function (err, rows, fields) {
    if (err) throw err
    //console.log(JSON.stringify(rows)+"SQL Query Has Fired");
    // console.log(JSON.parse(JSON.stringify(rows))) 
    // console.log(req.params);
    res.send(rows);
    console.log(req.body);
  })
})

app.post('/mydata/saved', (req, res) => {
  debugger;
  var obj = {};
  obj = req.body;
  let qry = 'SELECT * from client where id = ? and name = ?';
  qry = 'insert into userrole values (?,?,?)'
  console.log(obj);
  //sqlco.query(qry, [obj.id,obj.name], function (err, rows, fields) {
  sqlco.query(qry, [obj.firstName, obj.Username, obj.pswd], function (err, rows, fields) {

    if (err) throw err
    //console.log(JSON.stringify(rows)+"SQL Query Has Fired");
    //console.log(JSON.parse(JSON.stringify(rows))) 
    console.log(req.params);

    res.send(req.body);
    console.log(req.body);
  })
})


const ap = require('./Models/appModel');
const authuser = require('./authorization/TokenUser');
const { json } = require('body-parser');
const decode = require('jwt-decode')
const router = express.Router();

router.use('/userid/:id/pasword/:password', (req, res, next) => {
  console.log('Request URL:', req.originalUrl)
  next()
}, (req, res, next) => {
  console.log('Request Type:', req.method)
  next()
})
router.get('/userid/:id/pasword/:password', async (request, response) => {

  //await.auth.setCurrentUser()
  console.log(request.params);
  var obj = {};
  // Mam 1 mint bs
  userdata.get
  var mypromise = await new Promise((resolve, rej) => {
    sqlco.query('SELECT * from Userrole where id = ? and pswd = ? ', [request.params.id, request.params.password], function (err, rows, _fields) {
      if (err)
      rej( err);
      console.log(rows);
      resolve(rows)
      //return rows;
      obj = rows;
    //  res(rows)

    })
    serviceObj.clientsave(); //Class method call
})
  console.log(`SQL Query Run`);

  console.log("====>",mypromise,"<===========");



  console.log('end');
//  sessionStore.userid = req.session 
request.session.name=request.params.id
  if (true) {
    console.log(`here `)
    let tokn = await authuser.setCurrentUser(request.params);
    console.log(tokn)
    //tokn = decode(tokn)
    response.cookie('rahuloo', tokn, {
      expires: new Date(Date.now() + 100000)

    })

    //obj.tokn = tokn;
    console.log(`Rahul${tokn}`);
    console.log(obj)
    //res.send(JSON.stringify(obj));
    response.send(JSON.stringify(tokn));
  }
});
app.use('/', router)

///Image Upload
const storage = multer.diskStorage({
  //dest: __dirname + '/views',
  destination: function (req, file, callback) {
    callback(null, __dirname + '/views');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});
var upload = multer({ storage: storage });

app.all('/uploadimage', upload.single('file'), async (req, res) => {
 try{
  serviceObj.clientsave();
  if(jhg)
  res.send("class has called")
  if (!req.body) {
    res.send({
      massage: "File Has Uploaded",
      path: req.file.path
    })
  }
  console.log('==============>', req.file);
  //await userdataobj.getphoto(pic)
}catch(err){
res.status(300).json(err)
}
})


app.listen(port);
console.log(` http://localhost:${3030}`)
const d = new Date();
console.log('API server started on: ' + port + ' With Timing=> ' + d.toLocaleString());


/////###### Select Node.js => select Run Script:start  OR   javascript debug terminal
/////###### In Run Click Start Debugging f5
