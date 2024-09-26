import { Router } from "express";
import { login, resetPassword, signup } from "../controllers/auth.controller";
import {
  loginValidator,
  resetPasswordValidator,
  signupValidator,
} from "../validators/auth.validator";
import validator from "../middleware/validator";

const router = Router();

router.post("/signup", signupValidator, validator, signup);
router.post("/login", loginValidator, validator, login);
router.post(
  "/reset-password",
  resetPasswordValidator,
  validator,
  resetPassword
);

export default router;
