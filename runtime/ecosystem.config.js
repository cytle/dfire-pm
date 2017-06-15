const path = require('path');
const { projectsCWD } = require('../config');

const npmRunScript = path.resolve(__dirname, '../scripts/npm-run.sh');

const apps = ['meal', 'om', 'bill', 'shop', 'marketing'].map(appName => ({
  name: appName,
  cwd: path.resolve(projectsCWD, `static-${appName}`),
  script: npmRunScript,
  env: {
    NODE_ENV: 'dev',
  },
}));

module.exports = { apps };
