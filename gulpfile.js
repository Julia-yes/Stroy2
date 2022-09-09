'use strict';

const { src, dest, parallel, watch } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const webpack = require('webpack');
const webpackStream = require('webpack-stream');

const isProduction = process.env.NODE_ENV.trim() === 'production';

let es6Config = {
  mode: process.env.NODE_ENV.trim(),
  output: {
    filename: '[name].js',
  },
  watch: !isProduction,
  module: {
    rules: [
      {
        loader: 'babel-loader'
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
  },
  optimization: {
    minimize: isProduction
  },
  devtool: false,
};

function buildStyles() {
  return src('./src/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(dest('./dist/css'));
};

function runWebpack() {
  return src('./src/js/script.js')
  .pipe(webpackStream(es6Config), webpack)
  .pipe(dest('./dist/js'));
}

function stylesWatcher() {
  return watch('./src/sass/**/*.scss', buildStyles);
}

exports.watch = parallel(
  runWebpack,
  stylesWatcher,
);

exports.build = parallel(
  runWebpack,
  buildStyles,
);
