import { Request, Response } from "express";
import { asyncHandler } from "../../../utils/asyncHandler";
import { ApiError } from "../../../utils/ApiError";
import {
  createPayment,
  getPaymentById,
  getPayments,
  reversePayment,
  cancelPayment,
} from "./payments.service";

const getSchoolId = (req: Request) => {
  const schoolId = req.tenant?.schoolId;

  if (!schoolId) {
    throw new ApiError(400, "School context is required");
  }

  return schoolId;
};

const getParam = (req: Request, key: string): string => {
  const value = req.params[key];

  if (!value || Array.isArray(value)) {
    throw new ApiError(400, `${key} is required`);
  }

  return value;
};

export const listPayments = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);

    const payments = await getPayments(schoolId);

    res.status(200).json({
      success: true,
      message: "Payments fetched successfully",
      data: payments,
    });
  },
);

export const getPayment = asyncHandler(async (req: Request, res: Response) => {
  const schoolId = getSchoolId(req);
  const id = getParam(req, "id");
  const payment = await getPaymentById(schoolId, id);

  res.status(200).json({
    success: true,
    message: "Payment fetched successfully",
    data: payment,
  });
});

export const createPaymentController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);

    if (!req.user?.id) {
      throw new ApiError(401, "Authentication required");
    }

    const payment = await createPayment({
      schoolId,
      userId: req.user.id,
      studentId: req.body.studentId,
      receiptNo: req.body.receiptNo,
      amount: req.body.amount,
      paymentDate: req.body.paymentDate,
      method: req.body.method,
      referenceNo: req.body.referenceNo,
    });

    res.status(201).json({
      success: true,
      message: "Payment created successfully",
      data: payment,
    });
  },
);

export const reversePaymentController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const id = getParam(req, "id");

    const payment = await reversePayment(schoolId, id, req.body.reversalReason);

    res.status(200).json({
      success: true,
      message: "Payment reversed successfully",
      data: payment,
    });
  },
);

export const cancelPaymentController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const id = getParam(req, "id");

    const payment = await cancelPayment(schoolId, id);

    res.status(200).json({
      success: true,
      message: "Payment cancelled successfully",
      data: payment,
    });
  },
);
