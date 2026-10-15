import { Request, Response } from "express";
import { asyncHandler } from "../../../utils/asyncHandler";
import { ApiError } from "../../../utils/ApiError";

import {
  approveLeaveRequestService,
  cancelLeaveRequestService,
  createLeaveRequestService,
  deleteLeaveRequestService,
  getLeaveRequestByIdService,
  getLeaveRequestsService,
  rejectLeaveRequestService,
  updateLeaveRequestService,
} from "./leave-requests.service";

const getParam = (req: Request, name: string): string => {
  const value = req.params[name];

  if (!value || typeof value !== "string") {
    throw new ApiError(400, `${name} is required`);
  }

  return value;
};

const getSchoolId = (req: Request): string => {
  const schoolId = req.tenant?.schoolId;

  if (!schoolId) {
    throw new ApiError(403, "School context is required");
  }

  return schoolId;
};

const getCurrentUserId = (req: Request): string => {
  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(401, "Authentication required");
  }

  return userId;
};

export const getLeaveRequests = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);

    const leaveRequests = await getLeaveRequestsService(schoolId);

    res.status(200).json({
      success: true,
      message: "Leave requests fetched successfully",
      data: leaveRequests,
    });
  },
);

export const getLeaveRequestById = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const leaveRequestId = getParam(req, "id");

    const leaveRequest = await getLeaveRequestByIdService(
      schoolId,
      leaveRequestId,
    );

    res.status(200).json({
      success: true,
      message: "Leave request fetched successfully",
      data: leaveRequest,
    });
  },
);

export const createLeaveRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);

    const leaveRequest = await createLeaveRequestService(schoolId, req.body);

    res.status(201).json({
      success: true,
      message: "Leave request created successfully",
      data: leaveRequest,
    });
  },
);

export const updateLeaveRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const leaveRequestId = getParam(req, "id");

    const leaveRequest = await updateLeaveRequestService(
      schoolId,
      leaveRequestId,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Leave request updated successfully",
      data: leaveRequest,
    });
  },
);

export const deleteLeaveRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const leaveRequestId = getParam(req, "id");

    await deleteLeaveRequestService(schoolId, leaveRequestId);

    res.status(200).json({
      success: true,
      message: "Leave request deleted successfully",
    });
  },
);

export const approveLeaveRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const leaveRequestId = getParam(req, "id");
    const approvedById = getCurrentUserId(req);

    const leaveRequest = await approveLeaveRequestService(
      schoolId,
      leaveRequestId,
      approvedById,
    );

    res.status(200).json({
      success: true,
      message: "Leave request approved successfully",
      data: leaveRequest,
    });
  },
);

export const rejectLeaveRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const leaveRequestId = getParam(req, "id");
    const approvedById = getCurrentUserId(req);

    const leaveRequest = await rejectLeaveRequestService(
      schoolId,
      leaveRequestId,
      approvedById,
    );

    res.status(200).json({
      success: true,
      message: "Leave request rejected successfully",
      data: leaveRequest,
    });
  },
);

export const cancelLeaveRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const leaveRequestId = getParam(req, "id");

    const leaveRequest = await cancelLeaveRequestService(
      schoolId,
      leaveRequestId,
    );

    res.status(200).json({
      success: true,
      message: "Leave request cancelled successfully",
      data: leaveRequest,
    });
  },
);
