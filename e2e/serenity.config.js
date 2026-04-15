const path = require('path');

const outputDirectory = path.resolve(__dirname, 'target/site/serenity');

module.exports = {
  outputDirectory,
  crew: [
    '@serenity-js/console-reporter',
    '@serenity-js/serenity-bdd',
    ['@serenity-js/core:ArtifactArchiver', { outputDirectory }],
    ['@serenity-js/web:Photographer', { strategy: 'TakePhotosOfFailures' }],
  ],
};
