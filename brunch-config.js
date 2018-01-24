/* eslint-disable import/no-extraneous-dependencies */
const htmlBrunchStatic = require('html-brunch-static');
const pugBrunchStatic = require('pug-brunch-static');
const postCssCssNext = require('postcss-cssnext');

module.exports = {
  paths: {
    watched: ['app'],
  },
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
    static: {
      processors: [
        htmlBrunchStatic({
          processors: [
            pugBrunchStatic({
              fileMatch: 'app/**/*.pug',
              fileTransform: filename => filename.replace(/\.pug$/, '.html'),
              basedir: 'app',
            }),
          ],
        }),
      ],
    },
    babel: { presets: ['latest'] },
    postcss: {
      processors: [postCssCssNext],
    },
  },
};
