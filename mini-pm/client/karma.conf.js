module.exports = function (config) {
  process.env.CHROME_BIN = require('puppeteer').executablePath();

  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    browsers:   ['ChromeHeadless'],
    reporters:  ['dots', 'kjhtml'],
  });
};