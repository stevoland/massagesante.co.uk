module.exports = function (grunt) {

  grunt.initConfig({
    sass: {
      dist: {
        style: [
          'app/sass/_utils.scss',
          'app/sass/_normalize.scss',
          'app/sass/_main.scss',
          'app/sass/_helpers.scss'
        ],
        ltie9: [
          'app/sass/_lt-ie9.scss',
          'app/sass/_utils.scss',
          'app/sass/_normalize.scss',
          'app/sass/_main.scss',
          'app/sass/_helpers.scss'
        ],
        files: {
          'app/static/stylesheets/style.css': '<%= sass.dist.style %>',
          'app/static/stylesheets/lt-ie9.css': '<%= sass.dist.ltie9 %>'
        }
      }
    },

    watch: {
      sass: {
        files: [
          '<%= sass.dist.style %>',
          '<%= sass.dist.ltie9 %>'
        ],
        tasks: 'sass'
      }
    },

    reduce: {
        root: 'app',
        outRoot: 'dist',
        include: [
          '**/*.mmm',
          '*.txt',
          '*.ico'
        ],
        fixTemplateTags: '{{ }}'
    },

    copy: {
      build: {
        files: [
          { src: 'app/*.js', dest: 'dist/', expand: true, flatten: true },
          { src: 'app/routes/*.js', dest: 'dist/routes/', expand: true, flatten: true }
        ]
      }
    },

    crypt: {
      files: [
        {
          dir: 'app',
          include: 'config.js',
          encryptedExtension: '.encrypted'
        }
      ],
      options: {
        key: grunt.cli.options.key
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-crypt');
  grunt.loadNpmTasks('grunt-reduce');

  grunt.registerTask('build', ['sass', 'decrypt', 'copy', 'reduce']);
  grunt.registerTask('default', ['build']);
};