var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({extended:false});

module.exports = function(app){
    app.get("/", function(req,res){
        res.render("home/login");
    });

    app.post("/log", urlencodedParser, function(req,res){
        var user_name = req.body.user_name;
        var password = req.body.password;
        //res.send(user_name);

        req.session.user_name = user_name;
        req.session.password = password;


        //서버 메인으로 재요청
        res.redirect("main");
    });


    app.get("/main", function(req,res){


        res.render("home/main.ejs");
    });

    app.get("/schema", function(req,res){
        res.render("home/schema.ejs");
    });

    app.post("/schemaa", urlencodedParser, function(req,res){
        var id = req.body.id;
        var report = req.body.report;
        var paper = req.body.paper;
        //res.send(user_name);

        req.session.id = id;
        req.session.report = report;
        req.session.paper = paper;
        console.log(req.session.id);

        res.redirect("schema");
    });

    app.get("/identity", function(req, res){
        res.render("home/identity.ejs");
    })
}