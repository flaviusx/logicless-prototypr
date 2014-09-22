//Filename: boilerplate.js
require([
    'jquery',
    'handlebars'
], function($, Handlebars){
    Articles = function(element, handlebars){
        this.element = element;
        this.template = Handlebars.compile(handlebars);
    };
    Articles.prototype.fetch = function(restURL){
        return $.ajax({
            url: restURL,
            type: "GET",
            dataType: "json"        
        });
    };
    Articles.prototype.render = function(data){ 
        var self = this;
        $.each(data["articles"], function(i, article){
            var html = self.template(article);
            self.element.append(html);
        });
    };
    $(document).ready(function(){
        var articlesApp = new Articles($("#articles"), $("#article-template").html());
        var articlesReq = articlesApp.fetch("http://localhost/rest/articles")
        articlesReq.done(articlesApp.render.bind(articlesApp));
    });
}, function (err) {
    throw(err);
});

