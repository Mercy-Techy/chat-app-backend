import { body } from "express-validator";

export const usernameValidator = body("username")
  .notEmpty()
  .isString()
  .isLength({ min: 3, max: 15 });

export const secretValidator = body("secret").notEmpty().isString();
