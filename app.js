const express = require('express');
require('dotenv').config(); // load .env file
global.__basedir = __dirname; // set root directory
const logger = require('./utils/logger/index');

const app = express();
app.set('port', process.env.PORT);

app.get('/', (req, res) => {
  logger.info('Route /');
  res.send('Express App Running!');
});

app.listen(app.get('port'), () => {
  logger.info(`API Server running at http://localhost:${app.get('port')} (${app.get('env')})`);
  logger.info('Press CTRL-C to stop\n');
})