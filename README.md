logicless-prototypr
===================

> Logic less UI prototyping with nodejs


TO install:
----------

1. Install nodejs
2. Git clone logicless-prototypr
3. Install node packages:
    npm install
3. Install bower packages:
    bower install
    * If error then try to install bower globally:
    npm install -g bower
4. Run grunt job to initialize project:
    grunt init:dev
    * If error then try to install grunt globally:
    npm install -g grunt-cli
5. Run grunt job to compile resources:
    build:dev
6. Start node server:
   node server.js
   
Open browser at: http://localhost:3000/simple or http://localhost:3000/article or any name from views folder
  


To create a new view:
---------------------

1. Create a file in views folder as handlebars template
2. Create a json file with similar name in models folder for the template
3. Run server and check the results in browser
  
PS: This is a WIP (Work in Progress)
  
