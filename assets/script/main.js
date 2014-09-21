requirejs.config({
    baseUrl: 'assets/script',
    paths: {
        jquery: [
            //'http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min',
            'jquery/jquery'
        ],
        underscore: 'underscore/underscore',
        bootstrap: 'bootstrap/bootstrap',
        handlebars: 'handlebars/handlebars'
    },
    shim: {
        'bootstrap' : {
             deps: ['jquery', 'plugins/bootstrap-tooltip'],
        }
    }
});

;(function(){
    NodeList.prototype.forEach = Array.prototype.forEach; 
    HTMLCollection.prototype.forEach = Array.prototype.forEach;

    var scripts = document.querySelectorAll("script[data-src]");
    scripts.forEach(function(element, index){
        var js = element.getAttribute('data-src');
        require([js], function(){}, function(err){
            console.log("Error loading module: " + js);
        });
    });
}());