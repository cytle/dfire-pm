require('./render/compile');
const express = require('express');
const http = require('http');
const fs = require('fs');
const restartNginx = require('./actions/restartNginx');

const app = express();

restartNginx();

app.get('/nginx', (req, res) => {
  res.send(fs.readFileSync('../../runtime/nginx.conf'));
});

app.get('/conf', (req, res) => {
  res.send(fs.readFileSync('../../runtime/config.json'));
});

app.put('/conf', (req, res) => {
  res.send(fs.readFileSync('../../runtime/config.json'));
  restartNginx();
});

app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const httpServer = http.createServer(app);
httpServer.listen(3322, () => {
  console.log('Listening on port %d', httpServer.address().port);
});
