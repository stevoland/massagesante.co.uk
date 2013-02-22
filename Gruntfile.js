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
          { src: 'app/app.js', dest: 'dist/app.js' },
          { src: 'app/routes/index.js', dest: 'dist/routes/index.js' },
          { src: 'app/routes/contact.js', dest: 'dist/routes/contact.js' }
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-reduce');

  grunt.registerTask('build', ['sass', 'copy', 'reduce']);
  grunt.registerTask('default', ['build']);
};