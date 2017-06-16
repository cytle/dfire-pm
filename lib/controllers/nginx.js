const nginxModel = require('../models/nginx');

module.exports = {
  getNginx(req, res) {
    res.json({ data: nginxModel });
  },
};
