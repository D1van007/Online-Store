const HtmlWebpackPlugin = require('html-webpack-plugin');
// const CopyPlugin = require("copy-webpack-plugin");
require('webpack');
const path = require('path');

module.exports = {
  entry: './src/pages/cart/script.ts',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 9000,
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
  plugins: [
    new HtmlWebpackPlugin({ template: './src/pages/cart/index.html' }),
    // new CopyPlugin({
    //   patterns: [
    //     { from: "redirect", to: "" },
    //   ],
    // }),
  ],
  resolve: {
    extensions: [ ".tsx", ".ts", ".js", ".css" ]
  },
};