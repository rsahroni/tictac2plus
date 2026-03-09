const fs = require('fs');
const packageJson = require('./package.json');
const appJson = require('./app.json');

appJson.expo.version = packageJson.version;

fs.writeFileSync('./app.json', JSON.stringify(appJson, null, 2));
console.log(`Updated app.json version to: ${packageJson.version}`);
