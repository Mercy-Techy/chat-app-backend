import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export default (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      throw new Error(result.array()[0].msg);
    }
    next();
  } catch (error: any) {
    next(error);
  }
};
