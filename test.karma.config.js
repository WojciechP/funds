var webpackConfig = require('./test.webpack.config');

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai'],
    files: [,
      'node_modules/babel-polyfill/browser.js',
      'test/**/*.ts'
    ],
    exclude: ['test/**/*-seed.ts'],
    preprocessors: {
      'test/**/*.ts': ['webpack']
    },
    webpack: {
      module: webpackConfig.module,
      resolve: webpackConfig.resolve
    },
    reporters: ['mocha'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    singleRun: true,
    browsers: ['PhantomJS'],
    concurrency: Infinity
  })
}

