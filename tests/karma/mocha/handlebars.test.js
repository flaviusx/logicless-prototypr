define(['assets/script/app/handlebars', 'jquery', 'handlebars'], function(App, $, Handlebars) {
describe('Articles REST', function() {
  // Use Sinon to replace jQuery's ajax method
    // with a spy.
    beforeEach(function() {        
      sinon.spy($, 'ajax');
    });

    // Restor jQuery's ajax method to its
    // original state
    afterEach(function() {
      $.ajax.restore();
    })

    it('should compile template', function(done){
        var app = new Articles($("<div></div>"), "<title>{{title}}</title>");
        expect(app.template).to.be.ok;
        done();
    });
    it('should make an ajax call', function(done) {    
        var app = new Articles($("<div></div>"), "<title>{{title}}</title>");
        app.fetch("http://localhost/rest/articles").done();
        expect($.ajax.calledOnce).to.be.false; // see if the spy WASN'T called
        done(); // let Mocha know we're done async testing
    });
    it('should add articles', function(done){
        var articlesDiv = $("<div></div>");
        var app = new Articles(articlesDiv, "<title>{{title}}</title>");
        app.render({"articles":[{"title": "A"}]});
        expect($(articlesDiv).html()).to.be("<title>A</title>");
        done();
    });
});
});