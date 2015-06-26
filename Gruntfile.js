module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

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
  });

  /* For general use */
  grunt.loadNpmTasks('grunt-contrib-watch');

  /* For styles */
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-scss-lint');
  grunt.loadNpmTasks('grunt-postcss');


  /****
  * TASKS - TO USE WITH 'GRUNT TASKNAME'
  ****/
  grunt.registerTask('qualitycss', ['sass',
                                    'csslint']);

  grunt.registerTask('compress', ['cssmin']);

  grunt.registerTask('compile', ['qualitycss',
                                 'shell:checkSassSyntax',
                                 'sass',
                                 'postcss',
                                 'compress']);
};
