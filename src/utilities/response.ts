import { Response } from "express";

export type ServiceResponse = {
  status: boolean;
  message: string;
  data?: any;
};

export default (
  res: Response,
  message: string,
  data: any = null,
  code: number = 200
) => {
  return res.status(code).json({ message, data });
};
