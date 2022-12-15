const HtmlWebpackPlugin = require('html-webpack-plugin');
require('webpack');
const path = require('path');

module.exports = {
  entry: './src/index.ts',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  devServer: {
    historyApiFallback: true,
  },
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' },
      {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: 'style-loader',
            options: { injectType: 'singletonStyleTag' },
          },
          'css-loader',
        ],
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })],
  resolve: {
    extensions: [ ".tsx", ".ts", ".js" ]
  },
};