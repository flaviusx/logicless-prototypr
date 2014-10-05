/*!
 * main.js
 *
 * RequireJS main script that pushes dependencies required on a page
 * 
 * Copyright (C) 2014 Flavius Olaru
 * MIT Licensed
 */
;(function(){
    NodeList.prototype.forEach = Array.prototype.forEach; 
    HTMLCollection.prototype.forEach = Array.prototype.forEach;

    var scripts = document.querySelectorAll("script[data-src]");
    var deps = [];
    scripts.forEach(function(element, index){
        var js = element.getAttribute('data-src');
        deps.push(js);
    });
    deps.push('bootstrap');
    define(deps, function(){
        return {};
    });
}());