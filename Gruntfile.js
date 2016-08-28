var pkgjson = require('./package.json');

var config = {
    pkg: pkgjson,
    app: 'src',
    dist: 'dist'
};

module.exports = function (grunt) {

    // Configuration
    grunt.initConfig({
        config: config,
        pkg: config.pkg,

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> lib - v<%= pkg.version %> -' +
                '<%= grunt.template.today("yyyy-mm-dd") %> */'
            },
            dist: {
                files: {
                    '<%= config.dist %>/<%= pkg.version %>/<%= pkg.name %>.min.js': [
                        'src/namespace.js',
                        'src/hbarhelpers.js',
                        'src/linenumbers.js',
                        'src/options.js',
                        'src/getsource.js',
                        'src/markupcode.js'
                    ]
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['uglify']);
};
