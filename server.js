var express = require('express');
var app = express();
var expressHbs = require('express3-handlebars');
var hbs = require('hbs');
var fs = require('fs');
var glob = require("glob")

//app.engine('hbs', expressHbs({extname:'hbs', defaultLayout:'main.hbs'}));
app.engine('hbs', require('hbs').__express);
app.set('view engine', 'hbs');

hbs.registerPartials(__dirname + '/views/partials');

app.use(express.static(__dirname + '/'));

app.get('/', function(req, res){
    var json = 'models/index.json';
    if(req.query.json) {
        json = 'models/' + req.query.json;
    }
    fs.readFile(json, 'utf-8', function(err, data){
        res.render('index', JSON.parse(data));
    });
});

glob("*.hbs", {'cwd': 'views'}, function (er, files) {
    files.forEach(function(file){
        var view = file.replace(".hbs", "");
        console.log(view);
        app.get('/'+view, function(req, res){
            var json = 'models/'+view+'.json';
            if(req.query.json) {
                json = 'models/' + req.query.json;
            }
            fs.readFile(json, 'utf-8', function(err, data){
                res.render(view, JSON.parse(data));
            });
        });
    });  
})

app.listen(80);