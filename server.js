var express = require('express');
var app = express();
var expressHbs = require('express3-handlebars');
var hbs = require('hbs');
var fs = require('fs');
var glob = require("glob");
var _ = require('underscore');

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
        console.log("registering route /" + view);
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
});

glob("*", {'cwd': 'rest'}, function (er, files) {
    files.filter(function (file) {
        return fs.statSync(__dirname +'/rest/'+ file).isDirectory();
    }).forEach(function(dirname){
        console.log("registering rest service /rest/" + dirname)
        app.get('/rest/'+dirname, function(req, res) {
            var json = 'rest/'+dirname+'/get.json';   
            fs.readFile(json, 'utf-8', function(err, data){
                res.json(JSON.parse(data));
            });
        });
        app.get('/rest/'+dirname+'/:id', function(req, res) {
            var json = 'rest/'+dirname+'/get.json';
            fs.readFile(json, 'utf-8', function(err, data){                
                res.json(_.filter(JSON.parse(data)[dirname], function(item){
                    return item.id == req.params.id;
                })[0]);
            });
        });
        app.post('/rest/'+dirname, function(req, res) {
            var json = 'rest/'+dirname+'/post.json';   
            fs.readFile(json, 'utf-8', function(err, data){
                res.json(JSON.parse(data));
            });
        });
        app.put('/rest/'+dirname+'/:id', function(req, res) {
            var json = 'rest/'+dirname+'/put.json';   
            fs.readFile(json, 'utf-8', function(err, data){
                res.json(JSON.parse(data));
            });
        });
        app.delete('/rest/'+dirname+'/:id', function(req, res) {
            var json = 'rest/'+dirname+'/delete.json';   
            fs.readFile(json, 'utf-8', function(err, data){
                res.json(JSON.parse(data));
            });
        });
    });
});

glob("*", {'cwd': '.'}, function(){});

app.listen(3000);