const express = require('express');
require('dotenv').config(); // load .env file

const app = express();
app.set('port', process.env.PORT);

app.get('/', (req, res) => {
  res.send('Express App Running!');
});

app.listen(app.get('port'), () => {
  console.log(`API Server running at http://localhost:${app.get('port')} (${app.get('env')})`);
  console.log('Press CTRL-C to stop\n');
})