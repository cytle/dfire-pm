const path = require('path');

function createEcosystemConfig(projectsCWD) {
  const npmRunScript = path.resolve(__dirname, './scripts/npm-run.sh');

  const apps = ['meal', 'om', 'bill', 'shop', 'marketing'].map(appName => ({
    name: appName,
    cwd: path.resolve(projectsCWD, `static-${appName}`),
    script: npmRunScript,
    env: {
      NODE_ENV: 'dev',
    },
  }));

  return { apps };
}

module.exports = createEcosystemConfig();
