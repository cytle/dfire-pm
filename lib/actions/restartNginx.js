const createNginx = require('./createNginx');

function restartNginx() {
  createNginx();
  // TODO restart
}

module.xports = restartNginx;
