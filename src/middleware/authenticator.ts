import { Response, NextFunction, Request } from "express";
import { decodeJWT } from "../utilities/jwt";
import { UserModel } from "../models/user.model";
import { Req } from "../types";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) throw new Error("Unauthorized");
    const payload = decodeJWT(token);
    let user = await UserModel.findById(payload._id).populate({
      path: "avatar",
      select: "url",
    });
    if (!user) throw new Error("Invalid Token");
    (req as Req).user = user;
    next();
  } catch (error: any) {
    next(error);
  }
};
