const HtmlWebpackPlugin = require('html-webpack-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')
module.exports = (env) => {
  const isDev =
    typeof env.development !== 'undefined' && env.development === true
  return {
    mode: env.development ? 'development' : 'production',
    output: {
      filename: '[name].[contenthash].js',
    },
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
          use: [
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
          ],
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '...'],
    },
    plugins: [
      ...(isDev
        ? [
            new webpack.HotModuleReplacementPlugin(),
            new ReactRefreshWebpackPlugin(),
          ]
        : [
            new MiniCssExtractPlugin({
              filename: '[name].[contenthash].css',
            }),
          ]),
      new HtmlWebpackPlugin({
        title: 'MindMapping',
        template: './src/index.html',
      }),
    ],
  }
}
