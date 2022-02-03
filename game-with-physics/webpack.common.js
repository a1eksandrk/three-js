const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    app: path.resolve(__dirname, './src/index.js'),
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, './dist'),
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: { presets: ['@babel/preset-env'] }
        }
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: './public' },
        { from: './src/assets', to: './assets', noErrorOnMissing: true }
      ]
    })
  ],
  resolve: {
    extensions: ['', '.js'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
};
