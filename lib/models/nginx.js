const fs = require('fs');
const path = require('path');
const renderNginx = require('../../templates/nginx.tpl');
const configModel = require('./config');
const runtimeConfigModel = require('./runtimeConfig');

const configPath = path.resolve(__dirname, '../runtime/nginx.conf');

let realConfig = fs.readFileSync(configPath).toString();
module.exports = {
  get config() {
    return realConfig;
  },
  rewriteConfig() {
    const { nginx } = runtimeConfigModel.config;
    realConfig = renderNginx(Object.assign({}, nginx, {
      projectsCWD: configModel.projectsCWD,
      localApps: nginx.localApps.join('|') || 'noapp',
    }));
    fs.writeFileSync(configPath, realConfig);
    return this;
  },
  restart() {
    // TODO nginx restart
    return this;
  },
  stop() {
    // TODO nginx restart
    return this;
  },
  start() {
    // TODO nginx restart
    return this;
  },
  toString() {
    return this.toJSON();
  },
  toJSON() {
    return this.config;
  },
};
