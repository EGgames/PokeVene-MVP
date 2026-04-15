require('dotenv').config();
const serenityConfig = require('./serenity.config');

exports.config = {
  // ---------------------------------------------------------------------------
  // Serenity/JS + Cucumber integration
  // ---------------------------------------------------------------------------
  framework: '@serenity-js/webdriverio',

  serenity: {
    runner: 'cucumber',
    crew: serenityConfig.crew,
  },

  cucumberOpts: {
    require: [
      './step-definitions/**/*.js',
      './support/hooks.js',
    ],
    tags: 'not @wip',
    timeout: 30000,
  },

  // ---------------------------------------------------------------------------
  // Feature files
  // ---------------------------------------------------------------------------
  specs: ['./features/**/*.feature'],

  // ---------------------------------------------------------------------------
  // Browser capabilities
  // ---------------------------------------------------------------------------
  capabilities: [{
    browserName: 'chrome',
    'goog:chromeOptions': {
      args: [
        '--headless',
        '--disable-gpu',
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--window-size=1280,1024',
      ],
    },
  }],

  services: [],

  // ---------------------------------------------------------------------------
  // Base URL & timeouts
  // ---------------------------------------------------------------------------
  baseUrl: process.env.BASE_URL || 'http://localhost:5173',

  waitforTimeout: 30000,
  connectionRetryTimeout: 60000,
  connectionRetryCount: 3,

  // ---------------------------------------------------------------------------
  // Reporters
  // ---------------------------------------------------------------------------
  reporters: ['spec'],

  logLevel: 'warn',
};
