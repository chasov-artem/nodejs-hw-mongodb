import createHttpError from 'http-errors';

export const validateBody = (schema) => {
  return (req, res, next) => {
    const result = schema.validate(req.body, { abortEarly: false });
    if (typeof result.error !== 'undefined') {
      return next(
        createHttpError(
          400,
          result.error.details.map((error) => error.message).join('|'),
        ),
      );
    }
    next();
  };
};
