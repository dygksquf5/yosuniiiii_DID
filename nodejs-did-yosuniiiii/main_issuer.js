var express = require("express");
var ejs = require("ejs");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var methodOverride = require('method-override');




var app = express();

// Other settings
app.set("views",__dirname + "/views");
app.set("view engine", "ejs");
app.set("ejs", ejs.renderFile);
app.use(bodyParser.json());
app.use(methodOverride('_method'));


//미들웨어
app.use(cookieParser());
app.use(session({
    secret : "dmspdmsp",
    resave : false,
    saveUninitialized : true
}));


app.use(express.static("public"));

// Routes
require("./src/issuer")(app);

app.listen(3000, function(){
    console.log("포트 3000번으로 서버 실행 ! 완 료 오오! 크크");
});
