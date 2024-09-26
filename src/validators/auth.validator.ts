import { body } from "express-validator";

export const signupValidator = [
  body("username", "Username is required")
    .notEmpty()
    .isString()
    .isLength({ min: 3, max: 15 })
    .withMessage("Username length must fall between 3 and 15"),
  body("email", "Email is required").isEmail().normalizeEmail(),
  body("secret", "secret is required").notEmpty().isString(),
  body("password", "Password is required")
    .notEmpty()
    .isStrongPassword()
    .withMessage("Password is not strong enough"),
];

export const loginValidator = [
  body("email", "Email is required").notEmpty(),
  body("password", "Password is required").notEmpty(),
];
export const resetPasswordValidator = [
  body("email", "Email is required").notEmpty(),
  body("secret", "Secret is required").notEmpty(),
  body("newPassword", "New password is required")
    .notEmpty()
    .isStrongPassword()
    .withMessage("Password is not strong enough"),
];
