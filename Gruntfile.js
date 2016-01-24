module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    copy: {
      build: {
        cwd: 'src',
        src: [ '**', '!**/*.styl', '!**/*.coffee' ],
        dest: 'build',
        expand: true
      },
    },
    clean: {
      build: {
        src: [ 'build' ]
      },
      stylesheets: {
        src: [ 'build/**/*.css', '!build/<%= pkg.name %>.css' ]
      },
      scripts: {
        src: [ 'build/**/*.js', '!build/<%= pkg.name %>.js' ]
      },
      directories: {
        src: [ 'build/svg' ]
      }
    },
    stylus: {
      build: {
        options: {
          linenos: true,
          compress: false,
          use: [ require('kouto-swiss') ]
        },
        files: [{
          expand: true,
          cwd: 'src',
          src: [ '**/*.styl' ],
          dest: 'build',
          ext: '.css'
        }]
      }
    },
    autoprefixer: {
      build: {
        expand: true,
        cwd: 'build',
        src: [ '**/*.css' ],
        dest: 'build'
      }
    },
    cssmin: {
      build: {
        files: {
          'build/pre-embed.css': [ 'build/**/*.css', '!build/<%= pkg.name %>.css' ]
        }
      }
    },
    imageEmbed: {
      dist: {
        src: [ "build/pre-embed.css" ],
        dest: "build/<%= pkg.name %>.css",
        options: {
          deleteAfterEncoding : false
        }
      }
    },
    coffee: {
      build: {
        expand: true,
        cwd: 'src',
        src: [ '**/*.coffee' ],
        dest: 'build',
        ext: '.js'
      }
    },
    uglify: {
      build: {
        options: {
          banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
          mangle: true,
          compress: true,
          beautify: false
        },
        files: {
          'build/<%= pkg.name %>.js': [ 'build/**/*.js', '!build/<%= pkg.name %>.js' ]
        }
      }
    },
    watch: {
      stylesheets: {
        files: 'src/**/*.styl',
        tasks: [ 'stylesheets' ]
      },
      scripts: {
        files: 'src/**/*.coffee',
        tasks: [ 'scripts' ]
      },
      copy: {
        files: [ 'src/**', '!src/**/*.styl', '!src/**/*.coffee' ],
        tasks: [ 'copy' ]
      }
    },
    connect: {
      server: {
        options: {
          port: 4000,
          base: 'build',
          // hostname: '*'
        }
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks("grunt-image-embed");

  // Default task(s).
  grunt.registerTask(
    'scripts',
    'Compiles the scripts.',
    [ 'coffee', 'uglify', 'clean:scripts' ]
  );
  grunt.registerTask(
    'stylesheets',
    'Compiles the stylesheets.',
    [ 'stylus', 'autoprefixer', 'cssmin', 'imageEmbed', 'clean:stylesheets' ]
  );
  grunt.registerTask(
    'build',
    'Compiles all of the assets and copies the files to the build directory.',
    [ 'clean', 'copy', 'stylesheets', 'scripts' ]
  );
  grunt.registerTask(
    'distr',
    'Compiles all of the assets and copies the files to the build directory.',
    [ 'clean', 'copy', 'stylesheets', 'scripts', 'clean:directories' ]
  );
  grunt.registerTask(
    'default',
    'Watches the project for changes, automatically builds them and runs a server.',
    [ 'build', 'connect', 'watch' ]
  );
};