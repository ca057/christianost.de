const merge = require("webpack-merge");
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const common = require("./webpack.common");

module.exports = merge(common, {
  mode: "development",

  output: {
    filename: "[name].js"
  },

  devServer: {
    port: process.env.PORT || 3000,
    contentBase: path.join(process.cwd(), "./public"),
    watchContentBase: true,
    quiet: false,
    open: true,
    historyApiFallback: {
      rewrites: [{ from: /./, to: "404.html" }]
    }
  },

  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ["public/**/*.js", "content/webpack.json"]
    })
  ]
});
