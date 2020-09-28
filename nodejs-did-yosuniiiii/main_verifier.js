var express = require("express");
var ejs = require("ejs");
var cookieParser = require("cookie-parser");
var session = require("express-session");

var app = express();

app.set("views",__dirname + "/views");
app.set("view engine", "ejs");
app.set("ejs", ejs.renderFile);

app.use(cookieParser());
app.use(session({
    secret : "yohanyohan>_<",
    resave : false,
    saveUninitialized : true
}));

app.use(express.static("public"));

require("./routes/verifier")(app);

app.listen(3002, function(){
    console.log("포트 3002번으로 서버 실행 ! 완 료 오오! 크크");
});
