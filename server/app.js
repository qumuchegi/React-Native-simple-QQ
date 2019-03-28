var express = require('express');
var path = require('path');
var createError = require('http-errors');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'asset/user_avatar')));

//允许跨域
app.all('*',function(req,res,next) {
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-headers","Origin, X-Requested-With, Content-Type, Content-Length,Authorization,token,cache,Accept,yourHeaderFeild");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type","application/json;charset=utf-8");
    next();
    });
const user = require('./routers/user');

app.use('/user',user)
 
//app.get('/test',(req,res) => res.json({code:090}))

    // catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
let http = require('http')

let https = require('https')
let fs = require('fs')
const options = {
    key: fs.readFileSync(path.join(__dirname, './privatekey.pem')),
    cert: fs.readFileSync(path.join(__dirname, './certificate.pem'))
  }
  
http.createServer(app).listen(3003,console.log('正在监听3003'))
var server = https.createServer(app,options);
server.listen(3002,console.log('正在监听3002'));
//module.exports = app;
