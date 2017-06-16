const fs = require('fs');
const path = require('path');

const configPath = path.resolve(__dirname, '../runtime/config.json');

const realConfig = JSON.parse(fs.readFileSync(configPath));

module.exports = {
  get config() {
    return realConfig;
  },
  get nginx() {
    return this.config.nginx;
  },
  set nginx(c) {
    this.config.nginx = c;
  },
  writeConfig() {
    fs.writeFileSync(configPath, this.toString());
  },
  toString() {
    return this.toJSON();
  },
  toJSON() {
    return JSON.stringfy(this.config);
  },
};
