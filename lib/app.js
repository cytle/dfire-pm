require('./render/compile');
const express = require('express');
const http = require('http');
const renderNginx = require('../templates/nginx.tpl');

const app = express();

app.get('/', (req, res) => {
  res.send(renderNginx({
    nginxPort: '82',
    localApps: ['meal', 'bill'],
    appsCwd: '/c/src/js/',
    webpackHmrApp: 'meal',
  }));
});

app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const httpServer = http.createServer(app);
httpServer.listen(3322, () => {
  console.log('Listening on port %d', httpServer.address().port);
});
