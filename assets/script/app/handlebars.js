//Filename: boilerplate.js
require([
    'jquery',
    'handlebars'
], function($, Handlebars){
    $(document).ready(function(){
            var tpl = Handlebars.compile($("#article-template").html());
            $.ajax({
                url: "rest/articles",
                type: "GET",
                success: function(data){
                    var articles = data["articles"];
                    $.each(articles, function(i, article){
                        var html = tpl(article);
                        $("#articles").append(html);
                    });                    
                }
            });
        });
}, function (err) {
    console.log(err);
});