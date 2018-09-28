# winston daily logger

This is a customization of winston logger which does the following:

- Creates log files daily `app-logs-20-10-2018.log`

- Uploads the old log files to S3 for archival.

- Deletes old log files weekly from disk.

## How to use?

- Install all the required packages listed in `package.json`.
```
npm install --save winston;
npm install --save winston-daily-rotate-file;
npm install --save json-stringify-safe;
npm install --save dotenv;
npm install --save aws-sdk;
```

- Copy the `utils`, `config` and `logs` folder to your project root.

- Create a `.env` file with all the values as listed in `.env.example`.

- In your `app.js`/`index.js`/`main.js` file, add these lines to configure root folder and load `.env` file
```
global.__basedir = __dirname; // set root directory
require('dotenv').config(); // load .env file
```

- Now, just require the `logger` anywhere you want to use it.
```
const logger = require('./config/logger/index');

logger.error("error");
logger.warn("warning");
logger.info("info");
logger.debug("debug");
```

---
Feel free to raise issues if something doesn't works out for you. 

You can reach me out at https://twitter.com/vabhishek_me

As an addition, if you would like to contribute, checkout the `gzip-logs` branch. On this branch, I'm trying to gzip the log files and upload the .gz files to s3 and delete them as soon as they are uploaded. Its a work in progress.
