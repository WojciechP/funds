var path = require('path')

module.exports = {
  resolve: {
    root: path.resolve(__dirname),
    alias: {
      funds: 'src'
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx', '']
  },
  entry: ['babel-polyfill', 'src/index.ts'],
  output: {
    filename: './__test/index.es5.js'
  },
  module: {
    loaders: [
    {
      test: /\.tsx?$/,
      exclude: /node_modules/,
      loader: 'babel?presets=es2015&plugins=transform-object-assign'
    },
    {
      test: /\.tsx?$/,
      exclude: /node_modules/,
      loader: 'ts-loader'
    },
    ]
  }
}
