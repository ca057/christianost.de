const locals = require('./locals');

module.exports = {
  files: {
    javascripts: {
      joinTo: {
        'vendor.js': /^(?!app)/, // Files that are not in `app` dir.
        'app.js': /^app/,
      },
    },
    stylesheets: { joinTo: 'app.css' },
  },
  plugins: {
    pug: { locals },
    babel: { presets: ['latest'] },
  },
};
