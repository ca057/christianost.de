const locals = require('./locals');

module.exports = {
  files: {
    javascripts: {
      joinTo: {
        'vendor.js': /^(?!app)/, // Files that are not in `app` dir.
        'app.js': 'app/**/*.js',
      },
    },
    stylesheets: { joinTo: 'app.css' },
  },
  plugins: {
    pug: {
      locals,
      basedir: 'app/layouts',
      staticBasedir: 'app/layouts',
      pugRuntime: false,
      preCompile: true,
      preCompilePattern: /\.pug$/,
    },
    babel: { presets: ['latest'] },
  },
};
