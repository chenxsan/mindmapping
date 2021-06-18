const { startDevServer } = require('@cypress/webpack-dev-server')
const webpack = require('webpack')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
module.exports = (on, config) => {
  on('dev-server:start', (options) => {
    return startDevServer({
      options,
      webpackConfig: {
        module: {
          rules: [
            {
              test: /\.tsx?$/i,
              exclude: /node_modules/,
              use: [
                {
                  loader: 'babel-loader',
                },
              ],
            },
            {
              test: /\.css$/i,
              use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
          ],
        },
        resolve: {
          extensions: ['.tsx', '.ts', '...'],
        },
        plugins: [
          new webpack.HotModuleReplacementPlugin(),
          new ReactRefreshWebpackPlugin(),
        ],
      },
    })
  })

  return config
}
