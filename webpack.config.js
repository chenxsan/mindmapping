const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/i,
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '...'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'MindMapping',
      template: './src/index.html',
    }),
  ],
}
