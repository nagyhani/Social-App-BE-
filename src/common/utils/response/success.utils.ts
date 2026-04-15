import { Response } from "express";

type SuccessResponseParams = {
  res: Response;
  status?: number;
  message?: string;
  data?: any;
};

export const successResponse = ({
  res,
  status = 200,
  message = "Done",
  data = undefined,
}: SuccessResponseParams) => {
  return res.status(status).json({
    status,
    message,
    data,
  });
};