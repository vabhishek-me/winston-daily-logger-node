# winston daily logger

This is a customization of winston logger which does the following:
- Creates log files daily `app-logs-20-10-2018.log`
- Uploads the old log files to S3 for archival.
- Deletes old log files weekly from disk.

---
Feel free to raise issues if something doesn't works out for you. 

You can reach me out at https://twitter.com/vabhishek_me

As an addition, if you would like to contribute, checkout the `gzip-logs` branch. On this branch, I'm trying to gzip the log files and upload the .gz files to s3 and delete them as soon as they are uploaded. Its a work in progress.
