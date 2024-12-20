import { validationResult } from "express-validator";

export default (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const arrayOfErrors = errors.array({ onlyFirstError: true });
    return next({
      status: 422,
      message: "Validation failed:",
      data: arrayOfErrors,
    });
  }
  next();
};
