import { isHttpError } from 'http-errors';

const errorHandler = (err, req, res, next) => {
  if (isHttpError(err) === true) {
    return res
      .status(err.statusCode)
      .send({ status: err.statusCode, message: err.message });
  }
  const { status = 500, message = 'Something went wrong' } = err;
  res
    .status(status)
    .send({ status, message, data: err.message || 'Internal server error' });
};

export default errorHandler;
