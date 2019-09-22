'use strict'
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { entryJS, entryPage } = require('./setEntry')('src/pages')

const _PROD_ = process.env.NODE_ENV === 'production'

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

const _html = entryPage.map(item => {
  return new HtmlWebpackPlugin({
    filename: item.filename,
    template: item.file,
    inject: true,
    chunks: ["common", ...item.chunks],
    minify: {
      minifyJS: true,
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true
    },
  })
})

const webpackConfig = {
  mode: 'production',
  context: resolve('/'),

  entry: {
    common: resolve('src/common/index.js'),
    ...entryJS
  },

  output: {
    path: resolve('dist'),
    publicPath: './',
    filename: 'static/js/[name].[chunkhash].js',
    // chunkFilename: 'static/js/[name].[chunkhash].js'
  },

  resolve: {
    extensions: ['.js'],
    alias: {
      '@': resolve('src'),
    }
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src')]
      },
    ]
  },

  plugins: [
    new CleanWebpackPlugin(),
    ..._html
  ]
}

module.exports = webpackConfig
