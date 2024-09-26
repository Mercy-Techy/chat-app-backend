import { NextFunction, Response, Request } from "express";
import { UserModel } from "../models/user.model";
import response from "../utilities/response";
import bcrypt from "bcryptjs";
import { signJWT } from "../utilities/jwt";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const existingUsername = await UserModel.findOne({
      username: req.body.username,
    });
    if (existingUsername) throw new Error("Username is not available");
    const existingEmail = await UserModel.findOne({
      email: req.body.email,
    });
    if (existingEmail) throw new Error("Email is not available");
    await UserModel.create(req.body);
    return response(res, "Sign up successful");
  } catch (error: any) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { password, email } = req.body;
    const user = await UserModel.findOne({ email }).select("+password");
    if (!user) throw new Error("User does not exist");
    const isPasssword = await bcrypt.compare(password, user.password);
    if (!isPasssword) throw new Error("Invalid password");
    const token = signJWT({ email: user.email, _id: String(user._id) });
    return response(res, "Welcome to chat app", token);
  } catch (error: any) {
    next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { secret, email, newPassword } = req.body;
    const user = await UserModel.findOne({ email }).select("+secret");
    if (!user) throw new Error("User does not exist");
    const isSecret = await bcrypt.compare(secret, user.secret);
    if (!isSecret) throw new Error("Invalid secret");
    user.password = newPassword;
    await user.save();
    return response(res, "Password reset successful");
  } catch (error: any) {
    next(error);
  }
};
