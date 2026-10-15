import { Request, Response } from "express";
import { asyncHandler } from "../../../utils/asyncHandler";
import { ApiError } from "../../../utils/ApiError";
import {
  createEvent,
  deleteEvent,
  getEventById,
  getEvents,
  updateEvent,
} from "./events.service";

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

export const getEventsController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);

    const events = await getEvents(schoolId);

    res.status(200).json({
      success: true,
      message: "Events fetched successfully",
      data: events,
    });
  },
);

export const getEventByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);

    const eventId = getParam(req.params.id);

    const event = await getEventById(schoolId, eventId);

    res.status(200).json({
      success: true,
      message: "Event fetched successfully",
      data: event,
    });
  },
);

export const createEventController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);

    const event = await createEvent(schoolId, req.body);

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event,
    });
  },
);

export const updateEventController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);

    const eventId = getParam(req.params.id);

    const event = await updateEvent(schoolId, eventId, req.body);

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: event,
    });
  },
);

export const deleteEventController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);

    const eventId = getParam(req.params.id);

    await deleteEvent(schoolId, eventId);

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  },
);
