global.__basedir = __dirname; // set root directory
require('dotenv').config(); // load .env file

const express = require('express');
const logger = require('./utils/logger/index');
const config = require('./config/index');

const app = express();
app.set('port', process.env.PORT);

app.get('/', (req, res) => {
  logger.info('Route /', {'hello':'hi'}, {hey:'hi'});
  res.send('Express App Running!');
});

app.get('*', (req, res) => {
  logger.error('Route Not Found', req.url);
  res.send('Endpoint Not Found');
});

app.listen(app.get('port'), () => {
  logger.info(`API Server running at http://localhost:${app.get('port')} (${app.get('env')})`);
  logger.info('Press CTRL-C to stop\n');
})