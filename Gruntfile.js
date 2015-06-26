var PATH_TO_INSTALL = '/var/www/html/NGM/chatcenter';


module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

  /***
  * Tarea mediante la cual podemos correr comandos en el shell del SO,
  *  en expand la usamos para instalar dependencias del frontEnd
  ***/
    shell: {
      checkSassSyntax: {
        options: { stdout: true },
        command: [
          'echo Chequeando la syntaxis del codigo sass',
          'scss-lint sass/ -x SelectorFormat,ColorVariable',
          'echo Chequeo de syntaxis sass finalizado'
        ].join('&&')
      },
      installDep: {
        options: { stdout: true },
        command: [
          'echo Instalando dependencias...',
          'gem install sass',
          'echo Dependencias Intaladas!!'
        ].join('&&')
      },

      help: {
        options: { stdout: true },
        command: [
          'echo Puede ver este archivo en la carpeta /docs',
          'cat docs/docs.txt'
        ].join('&&')
      }
    },

  /***
  * Crea un unico archivo javascript y un unico archivo css con todo
  * lo necesario para que alcanze incluir esto y quede funcional.
  ***/
    concat: {
      options: {
        stripBanners: true,
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> */'
      },
      js: {
        src: ['lib/*.js',
              'js/tmp/templates.js',
              'js/expand_dom.js',
              'js/config.js',
              'js/expand.js'
            ],
        dest: 'build/js/<%= pkg.name %>.js'
      },
      css: {
        src: ['css/*.css'],
        dest: 'build/css/<%= pkg.name %>.css'
      }
    },

  /***
  * Minifica y comprime el js.
  ***/
    uglify: {
      js: {
        options: {
          report: 'gzip',
          preserveComments: false,
          drop_console: true,
        },
        src: [
          'build/js/<%= pkg.name %>.js'
        ],
        dest: 'build/js/<%= pkg.name %>.min.js'
      }
    },

  /***
  * Genera codigo css a partir de codigo SASS
  ***/
    sass: {
      dist: {
        options: {
          noCache: true,
          style: 'expanded',
          sourcemap: 'none'
        },
        files: [{
          expand: true,
          cwd: 'sass',
          src: ['*.scss'],
          dest: 'css',
          ext: '.css'
        }]
      }
    },

  /***
  * Minifica y comprime el css.
  ***/
    cssmin: {
      styles: {
        options: {
          report: 'gzip',
          keepSpecialComments: 0,
          drop_console: true,
          banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %> */',
        },
        files: {
          'build/css/<%= pkg.name %>.min.css': ['css/*.css']
        }
      }
    },

  /***
  * Chequea la calidad del codigo
  ***/
    gjslint: {
      options: {
        reporter: {
          name: 'console' //report to console
        },
        force: false //don't fail if python is not installed on the computer
      },
      lib: {
        src: ['js/*.js'],
      }
    },

  /***
  * Chequea la calidad del codigo css
  ***/
    csslint: {
      strict: {
        options: {
         'box-sizing': false,
         'adjoining-classes': false,
         'compatible-vendor-prefixes': false,
         import: 2
        },
        src: ['css/*.css',
              'css-themes/*.css']
      }
    },

  /***
  * Chequea la calidad del codigo scss
  ***/
    scsslint: {
      allFiles: [
        'sass/*.scss',
      ],
      options: {
        bundleExec: true,
        // config: '.scss-lint.yml',
        reporterOutput: 'scss-lint-report.xml',
        colorizeOutput: true
      },
    },

  /***
  * Agrega los prefix -moz, -web-kit, etc en los css
  *   chequeando contra la base can-i-use-db
  ***/
    postcss: {
      options: {
        map: true, // inline sourcemaps
        processors: [
          require('autoprefixer-core')({browsers: '> 5%, last 2 versions'}) // add vendor prefixes
        ]
      },
      multiple_files: {
        expand: true,
        flatten: true,
        src: 'css/*.css', // Obtengo los css generados por sass
        dest: 'css/' // Agrego los prefix y en el source
      }
    },

  /***
  * Corrige automaticamente errores de calidad en el codigo
  ***/
    fixjsstyle: {
      options: {
        reporter: {
          name: 'console'
        },
        force: false
      },
      lib: {
        src: ['js/*.js', 'tmp/*.js'],
      }
    },

  /***
  * Genera codigo javascript a partir de los templates escritos en HTML
  ***/
    htmlConvert: {
      options: {
        base: 'templates/',
        rename: '',
        quoteChar: '\''
      },
      mytemplate: {
        src: ['templates/*.html'],
        dest: 'js/tmp/templates.js'
      },
    },

  /***
  * Prepara el PATH_TO_INSTALL con una limpieza
  ***/
    clean: {
      frontEnd: [PATH_TO_INSTALL + '/cliente'],
      backend: [PATH_TO_INSTALL + '/backend']
    },

  /***
  * Copia el projecto al PATH_TO_INSTALL
  ***/
    copy: {
      frontEnd: {
        cwd: '../cliente',
        src: '**/*',
        dest: PATH_TO_INSTALL + '/cliente',
        expand: true
      }
    },

  /***
  * Copia el projecto al PATH_TO_INSTALL
  ***/
    watch: {
      css: {
        files: 'sass/*.scss',
        tasks: ['sass']
      },
      html: {
        files: 'templates/*.html',
        tasks: ['template']
      }
    }

  });

  /* For general use */
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-shell');

  /* For javascript */
  grunt.loadNpmTasks('grunt-gjslint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-html-convert');

  /* For styles */
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-scss-lint');
  grunt.loadNpmTasks('grunt-postcss');


  /****
  * TASKS - TO USE WITH 'GRUNT TASKNAME'
  ****/
  grunt.registerTask('installDep', ['shell:installDep']);

  grunt.registerTask('help', ['shell:help']);


  grunt.registerTask('template', ['htmlConvert']);

  grunt.registerTask('quality', ['gjslint',
                                 'csslint']);

  grunt.registerTask('qualitycss', ['sass',
                                    'csslint']);

  grunt.registerTask('fixquality', ['fixjsstyle']);

  grunt.registerTask('compress', ['uglify',
                                  'cssmin']);

  grunt.registerTask('compile', ['quality',
                                 'shell:checkSassSyntax',
                                 'sass',
                                 'htmlConvert',
                                 'postcss',
                                 'concat',
                                 'compress']);

  grunt.registerTask('deploy', ['compile',
                                'clean',
                                'copy']);

  grunt.registerTask('install', ['compile',
                                'clean',
                                'copy']);


};
