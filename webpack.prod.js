const merge = require("webpack-merge");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "production",

  output: {
    filename: "[name].[hash:5].js"
  },

  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      })
    ]
  }
});
