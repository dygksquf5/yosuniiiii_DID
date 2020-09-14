var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require("cookie-parser");
var methodOverride = require('method-override');
var session = require("express-session");

var app = express();


// Other settings
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(methodOverride('_method'));


//미들웨어
app.use(cookieParser())
app.use(session({
    secret:"dmspdmsp",
    resave: false,
    saveUninitialized : true
}));


// Routes
var router1 = require('./routes/router')(app);

// Port setting
var port = 3000;
app.listen(port, function(){
  console.log('3000번으로 실 행 !');
});
