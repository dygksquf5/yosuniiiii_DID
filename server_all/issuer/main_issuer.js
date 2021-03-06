var express = require("express");
var ejs = require("ejs");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var methodOverride = require('method-override');




var app = express();

app.set("view engine", "ejs");
app.set("ejs", ejs.renderFile);
app.use(methodOverride('_method'));


app.use(cookieParser());
app.use(session({
    secret : "dmspdmsp",
    resave : false,
    saveUninitialized : true
}));


app.use(express.static("public"));

require("./issuer")(app);

app.listen(3000, function(){
    console.log("포트 3000번으로 정부서버  실행 완료! ");
});
