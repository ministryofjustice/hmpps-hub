({
  baseUrl: '.',
  mainConfigFile: 'main.js',
  name: '../libs/almond/almond',
  include: 'main',
  out: 'main.min.js',
  uglify: {
        max_line_length: 200
  }
})