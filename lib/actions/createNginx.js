require('../render/compile');
const fs = require('fs');
const renderNginx = require('../../templates/nginx.tpl');
const config = require('../../config');

function createNginx() {
  const runtimeConfigStr = fs.readFileSync('../../runtime/config');
  const { nginx } = JSON.parse(runtimeConfigStr);
  nginx.projectsCWD = config.projectsCWD;

  const nginxConfig = renderNginx(nginx);

  fs.writeFileSync('../../runtime/nginx.conf', nginxConfig, (err) => {
    if (err) throw err;
    console.log('It\'s saved!');
  });
}

module.exports = createNginx;
