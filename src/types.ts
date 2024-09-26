import { IUser } from "./models/user.model";
import { Request } from "express";

export interface Req extends Request {
  user: IUser;
}

export interface file extends Express.Multer.File {}

export type cloudinaryReturnType = {
  public_id: string;
  format?: string;
  resource_type: string;
  created_at: string;
  url: string;
  bytes: number;
};
