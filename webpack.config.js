const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  devtool: 'inline-source-map',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    static: false,
    compress: true,
    port: 9000,
    host: '0.0.0.0'
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: 'assets/' }],
    }),
    new HtmlWebpackPlugin({
      template: "index.html",
      hash: true,
      minify: false
    }),
  ]
};