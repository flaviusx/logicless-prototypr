/*!
 * require.config.js
 *
 * RequireJS config script
 * 
 * Copyright (C) 2014 Flavius Olaru
 * MIT Licensed
 */
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

require(['main'], function(){
    return {};
});