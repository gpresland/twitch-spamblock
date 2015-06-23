module.exports = function (grunt) {
    
    'use strict';
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            scripts: {
                files: 'src/js/*.js',
                tasks: ['uglify']
            }
        },
        concat: {
            options: {
                separator: '\n',
                sourceMap: false
            },
            build: {
                src: [],
                dest: ''
            }
        },
        copy: {
            build: {
                files: [{
                    src: 'build/manifest.json',
                    dest: 'build/',
                    expand: true,
                    flatten: true
                }, {
                    src: 'resources/js/jquery-2.1.3.min.js',
                    dest: 'build/popup/',
                    expand: true,
                    flatten: true
                }, {
                    src: 'resources/images/logo_64.png',
                    dest: 'build/popup/',
                    expand: true,
                    flatten: true
                }, {
                    cwd: 'resources',
                    src: ['images/*'],
                    dest: 'build/',
                    expand: true
                }]
            }
        },
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    'build/popup/popup.min.css': ['src/popup/popup.css']
                }
            }
        },
        htmlmin: {
            build: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'build/popup/popup.html': 'src/popup/popup.html'
                }
            }
        },
        uglify: {
            build: {
                options: {
                    banner: '' +
                    '// TWITCH SpamBlock\n' +
                    '//\n' +
                    '// Copyright (c) Year(s), gpresland@gmail.com\n' +
                    '// Permission to use, copy, modify, and/or distribute this software for any purpose with\n' +
                    '// or without fee is hereby granted, provided that the above copyright notice and this\n' +
                    '// permission notice appear in all copies.\n' +
                    '//\n' +
                    '// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD\n' +
                    '// TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN\n' +
                    '// NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL\n' +
                    '// DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER\n' +
                    '// IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN\n' +
                    '// CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.\n',
                    sourceMap: false,
                    sourceMapIncludeSources : false,
                    wrap: true
                },
                files: {
                    'build/popup/popup.min.js': [
                        'src/popup/settings.js',
                        'src/popup/popup.js'
                    ],
                    'build/js/content.min.js': [
                        'src/js/settings.js',
                        'src/js/listener.js',
                        'src/js/injector.js'
                    ],
                    'build/js/resource.min.js': [
                        'src/js/filtering.js',
                        'src/js/ui.js',
                        'src/js/bootstrap.js'
                    ]
                }
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    
    grunt.registerTask('scripts', ['uglify']);
    grunt.registerTask('build',   ['cssmin', 'htmlmin', 'uglify', 'copy']);
    grunt.registerTask('default', ['build']);
};