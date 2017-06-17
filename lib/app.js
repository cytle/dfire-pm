const express = require('express');
const expressWs = require('express-ws');
const cors = require('cors');

const app = express();

expressWs(app);
app.use(cors());

app.get('/', (req, res, next) => {
  console.log('get route', req.testing);
  res.end();
});

app.ws('/', (ws, req) => {
  ws.on('message', (msg) => {
    console.log(msg);
    ws.send('hhhh');
  });
  console.log('socket', req.testing);
});

app.listen(3322);
