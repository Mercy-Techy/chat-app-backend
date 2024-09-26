import { Request, Response, NextFunction } from "express";
import response from "../utilities/response";

export default (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return response(res, error.message, null, 400);
};
