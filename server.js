/*!
 * Logicless Prototypr Application Server
 * 
 * Copyright (C) 2014 Flavius Olaru
 * MIT Licensed
 */

var express = require('express'),
    handlebars = require('express-handlebars');

var fs = require('fs'),
    glob = require('glob'),
    watchr = require('watchr');

var lorem = require('lorem-hipsum');

var app = express(),
    hbs = handlebars.create({
        extname: '.hbs',
        layoutsDir: 'layouts',
        partialsDir: 'views',
        helpers: {
            // Lorem hipsum helpers
            lorem_word: function() { 
                return lorem({count: 1, units: 'words'}); 
            },
            lorem_words: function(count, format) { 
                return lorem({count: count, units: 'words', format: format}); 
            },
            lorem_sentence: function() { 
                return lorem({count: 1, units: 'sentences'}); 
            },
            lorem_sentences: function(count, format) { 
                return lorem({count: count, units: 'sentences', format: format}); 
            },
            lorem_paragraph: function() { 
                return lorem({count: 1, units: 'paragraphs'}); 
            },
            lorem_paragraphs: function(count, format) { 
                return lorem({count: count, units: 'paragraphs', format: format}); 
            }
        }
    });

// Register `hbs.engine` with the Express app.
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

// Register static resources
app.use(express.static(__dirname + '/'));
app.use(express.static(__dirname + '/base'));

// Register index route
app.get('/', function(req, res){
    var json = 'models/index.json';
    if(req.query.json) {
        json = 'models/' + req.query.json;
    }
    fs.readFile(json, 'utf-8', function(err, data){
        res.render('index', JSON.parse(data));
    });
});


// Default json file to be used when populating a view without a json created
var defaultJSON = "models/index.json";

// Add watchr to a route
function watchRoute(route) {
    watchr.watch({
        paths: [route],
        listeners: {
            error: watchrErrorHandler,
            change: watchrCreateHandler
        }
    });
}

// Traversing a route to traverse or add views
function traverseRoute(route) {
    console.log("Traversing " + route);
    registerViews(route);
    var globRoute = (route != "." ? 'views/' + route : 'views');
    watchRoute(globRoute);
    glob("*", {'cwd': globRoute }, function (er, files) {
        files.filter(function (file) {
            return fs.statSync(__dirname +'/views/' + route + '/' + file).isDirectory();
        }).forEach(function(file){
            var newRoute = (route != "." ? route + '/' + file : file);
            console.log("Found new route " + newRoute);                
            traverseRoute(newRoute);            
        });  
    });
}

// Registering all hbs files as views
function registerViews(route) {
    var globRoute = (route != "." ? 'views/' + route : 'views');
    console.log("Registering views " + route);
    glob("*.hbs", {'cwd': globRoute }, function (er, files) {
        files.forEach(function(file){
            var view = file.replace(/\.hbs$/, "");
            registerView(route, view);                    
        });
    });
}

// Registering a view
function registerView(route, view) {
    var renderRoute = (route != "." ? route + "/" + view : view);
    var expressRoute = (route != "." ? "/" + renderRoute : "/" + view);
    console.log("Registering route " + expressRoute);
    app.route(expressRoute).get(function(req, res){        
        console.log("Requested route " + expressRoute);      
        var json = 'models/' + renderRoute + '.json';
        if(req.query.json) {
            json = 'models' + route + '/' + req.query.json;
        }
        fs.exists(json, function(exists){
            if(!exists) {
                json = defaultJSON;
            }
            fs.readFile(json, 'utf-8', function(err, data){
                console.log("Rendering view " + renderRoute);
                console.log("Rendering json " + json);
                if(!err) {                    
                    res.render(renderRoute, JSON.parse(data));
                } else {
                    res.render(renderRoute, null);
                }
            });
        });
    });
}

// Regex patterns to identify view and route
var viewPattern = (/^(?:.+\\)+(.+)\.hbs$/gi);
var routePattern = (/^views\\?(.+)\\+(?:.+\.hbs)$/gi);
// Callback to watchr file/folder creation
function watchrCreateHandler(changeType,filePath,fileCurrentStat,filePreviousStat) {
    if(changeType == 'create') {
        console.log("watchr filePath " + filePath);
        var routeMatch = routePattern.exec(filePath);
        console.log("watchr route match " + routeMatch);
        var viewMatch = viewPattern.exec(filePath);
        console.log("watchr view match " + viewMatch);   
        if(routeMatch && viewMatch) {
            // new view
            var route = routeMatch[1].replace(/\\/g, "/");
            var view = viewMatch[1];
            console.log("watchr route " + route);
            console.log("watchr view " + view);
            registerView(route, view);            
        } else if (fs.statSync(__dirname + '/' + filePath).isDirectory()) {
            // new folder
            var route = filePath.replace(/\\/g, "/");
            console.log("watchr route " + route);
            watchRoute(route);
        }
    }
}

// Callback to watchr error
function watchrErrorHandler(err) {
    console.log('Watchr error occured:', err);
}

// Initialize routes and views
traverseRoute('.');

glob("*", {'cwd': 'rest'}, function (er, files) {
    files.filter(function (file) {
        return fs.statSync(__dirname +'/rest/'+ file).isDirectory();
    }).forEach(function(dirname){
        console.log("Registering rest service /rest/" + dirname)
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

// Start our app server
app.listen(3000);