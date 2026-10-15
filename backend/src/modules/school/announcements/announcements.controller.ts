import { Request, Response } from "express";
import { asyncHandler } from "../../../utils/asyncHandler";
import { ApiError } from "../../../utils/ApiError";
import {
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncementById,
  getAnnouncements,
  updateAnnouncement,
} from "./announcements.service";

const getSchoolId = (req: Request): string => {
  const schoolId = req.tenant?.schoolId;

  if (!schoolId) {
    throw new ApiError(403, "School context is required");
  }

  return schoolId;
};

const getParam = (value: string | string[] | undefined): string => {
  if (typeof value !== "string") {
    throw new ApiError(400, "Invalid route parameter");
  }

  return value;
};

export const getAnnouncementsController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);

    const announcements = await getAnnouncements(schoolId);

    res.status(200).json({
      success: true,
      message: "Announcements fetched successfully",
      data: announcements,
    });
  },
);

export const getAnnouncementByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);

    const announcementId = getParam(req.params.id);

    const announcement = await getAnnouncementById(schoolId, announcementId);

    res.status(200).json({
      success: true,
      message: "Announcement fetched successfully",
      data: announcement,
    });
  },
);

export const createAnnouncementController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);

    const announcement = await createAnnouncement(schoolId, req.body);

    res.status(201).json({
      success: true,
      message: "Announcement created successfully",
      data: announcement,
    });
  },
);

export const updateAnnouncementController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);

    const announcementId = getParam(req.params.id);

    const announcement = await updateAnnouncement(
      schoolId,
      announcementId,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Announcement updated successfully",
      data: announcement,
    });
  },
);

export const deleteAnnouncementController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);

    const announcementId = getParam(req.params.id);

    await deleteAnnouncement(schoolId, announcementId);

    res.status(200).json({
      success: true,
      message: "Announcement deleted successfully",
    });
  },
);
