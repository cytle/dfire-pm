const realConfig = require('../../config');

module.exports = {
  get config() {
    return realConfig;
  },
  get projectsCWD() {
    return this.config.projectsCWD;
  },
  toString() {
    return this.toJSON();
  },
  toJSON() {
    return JSON.stringfy(this.config);
  },
};
