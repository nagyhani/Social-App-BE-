import { Response } from "express";

type SuccessResponseParams = {
  res: Response;
  status?: number;
  message?: string;
  data?: any;
  success?: boolean
};

export const successResponse = ({
  res,
  status = 200,
  message = "Done",
  success = true,
  data = undefined,
}: SuccessResponseParams) => {
  return res.status(status).json({
    status,
    message,
    data,
    success
  });
};