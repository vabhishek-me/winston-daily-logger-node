module.exports = {
  aws: {
    AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY
  },
  logger: {
    BUCKET_NAME: process.env.LOGGER_BUCKET_NAME
  }
};
