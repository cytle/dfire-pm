const fs = require('fs');
const path = require('path');

function getConfig(req, res) {
  res.json({
    data: fs.readFileSync(path.resolve(__dirname, '../runtime/config.json')).toString()
  });
}

module.exports = {
  getConfig
}
