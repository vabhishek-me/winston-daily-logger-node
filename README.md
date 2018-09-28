# winston daily logger

This is a customization of winston logger which does the following:
- Creates log files daily `app-logs-20-10-2018.log`
- Uploads the old log files to S3 for archival.
- Deletes old log files weekly from disk.