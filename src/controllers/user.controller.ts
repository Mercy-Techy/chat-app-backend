import { NextFunction, Request, Response } from "express";
import { UserModel } from "../models/user.model";
import { Req } from "../types";
import response from "../utilities/response";
import bcrypt from "bcryptjs";
import { createFile } from "../utilities/fileUploader";
import Paginator from "../utilities/paginator";

export const fetchUserDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as Req).user;
    return response(res, "User Details", user);
  } catch (error: any) {
    next(error);
  }
};

export const editUserName = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as Req).user;
    const existingUserName = await UserModel.findOne({
      username: req.body.username,
      _id: { $ne: user._id },
    });
    if (existingUserName) throw new Error("Username is not available");
    user.username = req.body.username;
    await user.save();
    return response(res, "Username edited");
  } catch (error: any) {
    next(error);
  }
};

export const changeSecret = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await UserModel.findById((req as Req).user._id).select(
      "+secret"
    );
    if (!user) throw new Error("User does not exist");
    const { secret, oldSecret } = req.body;
    const isSecret = bcrypt.compareSync(oldSecret, user.secret);
    if (!isSecret) throw new Error("Invalid secret");
    user.secret = secret;
    await user.save();
    return response(res, "Secret updated successfully");
  } catch (error: any) {
    next(error);
  }
};

export const uploadAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) throw new Error("File not uploaded");
    const user = (req as Req).user;
    let uploadDetails;
    if (user.avatar) {
      uploadDetails = await createFile(req.file, user.avatar);
    } else {
      uploadDetails = await createFile(req.file);
    }
    if (!uploadDetails.status) throw new Error(uploadDetails.message);
    user.avatar = uploadDetails.data?._id;
    await user.save();
    return response(res, "File uploaded");
  } catch (error: any) {
    next(error);
  }
};

export const fetchUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = +(req.query?.page || 1);
    const details = await Paginator(UserModel, page, 10, {
      path: "avatar",
      select: "url",
    });
    if (!details.status) throw new Error(details.message);
    return response(res, "Users", details.data);
  } catch (error: any) {
    next(error);
  }
};

export const searchUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const keyword = req.query?.keyword as string;
    const page = +(req.query?.page || 1);
    if (!keyword) {
      throw new Error("Keyword is required");
    }
    const regex = new RegExp(keyword, "i");
    const details = await Paginator(
      UserModel,
      page,
      10,
      {
        path: "avatar",
        select: "url",
      },
      {
        username: { $regex: regex },
      }
    );
    if (!details.status) throw new Error(details.message);
    return response(res, "Users", details.data);
  } catch (error: any) {
    next(error);
  }
};
