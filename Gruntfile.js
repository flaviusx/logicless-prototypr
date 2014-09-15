module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        bower: {
            install: {
                options: {
                    targetDir: 'assets',
                    layout: 'byComponent'
                }
            }
        },
        clean: {
            dev: ['assets/script/bootstrap.js', 'assets/css/bootstrap.css'],
            prod: ['assets/script/*.min.js', 'assets/css/*.min.css']
        },
        browserify: {
            bootstrap: {
                options: { debug: true },
                src: ['assets/script/bootstrap/js/*.js'],
                dest: 'assets/script/bootstrap/bootstrap.js'
            }
        },
        rename: {
            'bootstrapsass': {
                src: 'assets/sass/_bootstrap.scss',
                dest: 'assets/sass/bootstrap.scss'
            }
        },
        sass: {
            dist: {                            
                options: {
                    includePaths: ["assets/sass/bootstrap"]
                },
                files: [{
                    "assets/css/bootstrap/bootstrap.css": "assets/sass/bootstrap.scss"
                }]
            }
        },
        cssmin: {
            minify: {
                src: ['assets/css/bootstrap/bootstrap.css'],
                dest: 'assets/css/bootstrap/bootstrap.min.css'
            }
        },
        uglify: {
            compile: {
                options: {
                    compress: true,
                    verbose: true
                },
                files: [{
                    src: 'assets/script/bootstrap/bootstrap.js',
                    dest: 'assets/script/bootstrap/bootstrap.min.js'
                }, {
                    src: 'assets/script/jquery/jquery.js',
                    dest: 'assets/script/jquery/jquery.min.js'
                }, {
                    src: 'assets/script/underscore/underscore.js',
                    dest: 'assets/script/underscore/underscore.min.js'
                }, {
                    src: 'assets/script/main/main.js',
                    dest: 'assets/script/main/main.min.js'
                }]
            }
        },
        jshint: {
            files: ['assets/script/main/*.js'],
            options: {
                devel: true,
                globalstrict: true,
                node: true
            }
        },
        csslint: {
            strict: {
                options: {
                    import: 2
                },
                src: ['assets/css/*.css']
            },
            lax: {
                options: {
                    import: false
                },
                src: ['assets/css/*.css']
            }
        },
        watch: {
            scripts: {
                files: ['assets/script/*.js', 'assets/script/bootstrap/*.js', 'assets/sass/**'],
                tasks: ['clean:dev', 'clean:prod', 'browserify:bootstrap', 'sass']
            },
        }        
    });
    
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-rename');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('init:dev', ['bower:install', 'rename:bootstrapsass']);
    
    grunt.registerTask('build:validate', ['clean:prod', 'browserify:bootstrap', 'sass', 'jshint', 'csslint:strict']);
    
    grunt.registerTask('build:dev', ['clean:prod', 'browserify:bootstrap', 'sass']);
    grunt.registerTask('build:prod', ['clean:prod', 'browserify:bootstrap', 'sass', 'cssmin', 'uglify']);
};