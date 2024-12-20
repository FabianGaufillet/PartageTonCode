import { body } from "express-validator";
import {
  emailRegex,
  genders,
  minAge,
  passwordRegex,
  roles,
  userNameMaxLength,
  userNameMinLength,
} from "../utils/constants.js";

export const signupValidator = [
  body("username")
    .trim()
    .escape()
    .isAlphanumeric()
    .withMessage("Username can only contain alphanumeric characters")
    .isLength({ min: userNameMinLength, max: userNameMaxLength })
    .withMessage(
      `Username must be between ${userNameMinLength} and ${userNameMaxLength} characters long`,
    ),
  body("email")
    .trim()
    .escape()
    .matches(emailRegex)
    .withMessage("Please fill a valid email address"),
  body("role")
    .if(body("role").exists())
    .trim()
    .escape()
    .isIn(roles)
    .withMessage(`Role must be ${roles.join(" or ")}`),
  body("avatar")
    .if(body("avatar").exists())
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Avatar is required"),
  body("lastname")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Lastname is required")
    .isAlpha()
    .withMessage("Lastname can only contain alphabetical characters"),
  body("firstname")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Firstname is required")
    .isAlpha()
    .withMessage("Firstname can only contain alphabetical characters"),
  body("gender")
    .isIn(genders)
    .withMessage(`Gender must be ${genders.join(" or ")}`),
  body("age")
    .isFloat({ min: minAge })
    .withMessage(`Age must be greater or equal to ${minAge} years`),
  body("street")
    .if(body("street").exists())
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Street is required"),
  body("zipcode")
    .if(body("zipcode").exists())
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Zipcode is required")
    .isNumeric({ no_symbols: true })
    .withMessage("Zipcode must be numeric"),
  body("city")
    .if(body("city").exists())
    .trim()
    .escape()
    .notEmpty()
    .withMessage("City is required"),
  body("password")
    .trim()
    .escape()
    .matches(passwordRegex)
    .withMessage(
      "Password must contain at least 8 characters, one lowercase, one uppercase, one number and one special character",
    ),
];

export const updateUserValidator = [
  body("username")
    .if(body("username").exists())
    .trim()
    .escape()
    .isAlphanumeric()
    .withMessage("Username can only contain alphanumeric characters")
    .isLength({ min: userNameMinLength, max: userNameMaxLength })
    .withMessage(
      `Username must be between ${userNameMinLength} and ${userNameMaxLength} characters long`,
    ),
  body("email")
    .if(body("email").exists())
    .trim()
    .escape()
    .matches(emailRegex)
    .withMessage("Please fill a valid email address"),
  body("avatar")
    .if(body("avatar").exists())
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Avatar is required"),
  body("lastname")
    .if(body("lastname").exists())
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Lastname is required")
    .isAlpha()
    .withMessage("Lastname must be alphabetical"),
  body("firstname")
    .if(body("firstname").exists())
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Firstname is required")
    .isAlpha()
    .withMessage("Firstname must be alphabetical"),
  body("gender")
    .if(body("gender").exists())
    .isIn(genders)
    .withMessage(`Gender must be ${genders.join(" or ")}`),
  body("age")
    .if(body("age").exists())
    .isFloat({ min: minAge })
    .withMessage(`Age must be greater or equal to ${minAge} years`),
  body("street")
    .if(body("street").exists())
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Street is required"),
  body("zipcode")
    .if(body("zipcode").exists())
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Zipcode is required")
    .isNumeric({ no_symbols: true })
    .withMessage("Zipcode must be numeric"),
  body("city")
    .if(body("city").exists())
    .trim()
    .escape()
    .notEmpty()
    .withMessage("City is required"),
];

export const updatePasswordValidator = [
  body("oldPassword")
    .trim()
    .escape()
    .custom((value, { req }) => value !== req.body.password)
    .withMessage("Old password can't be the same as the new one"),
  body("password")
    .trim()
    .escape()
    .matches(passwordRegex)
    .withMessage(
      "Password must contain at least 8 characters, one lowercase, one uppercase, one number and one special character",
    ),
  body("repeatPassword")
    .trim()
    .escape()
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords don't match"),
];

export const updateRoleValidator = [
  body("userId")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("userId is required")
    .isMongoId()
    .withMessage("userId must be a valid mongo id"),
  body("role")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Role is required")
    .isIn(roles)
    .withMessage(`Role must be ${roles.join(" or ")}`),
];
