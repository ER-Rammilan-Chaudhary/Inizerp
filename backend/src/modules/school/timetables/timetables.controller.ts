import { Request, Response } from "express";

import { asyncHandler } from "../../../utils/asyncHandler";
import { ApiError } from "../../../utils/ApiError";

import {
  addPeriod,
  createTimetable,
  deletePeriod,
  deleteTimetable,
  getPeriods,
  getTimetableById,
  getTimetables,
  savePeriods,
  updateTimetable,
  upsertTimetable,
} from "./timetables.service";

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

export const getTimetablesController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);

    const query = res.locals.validatedQuery;

    const result = await getTimetables(schoolId, query);

    res.status(200).json({
      success: true,
      message: "Timetables fetched successfully",
      data: result.data,
      pagination: result.pagination,
    });
  },
);

export const getTimetableByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const timetableId = getParam(req.params.id);

    const timetable = await getTimetableById(schoolId, timetableId);

    res.status(200).json({
      success: true,
      message: "Timetable fetched successfully",
      data: timetable,
    });
  },
);

export const createTimetableController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);

    const timetable = await createTimetable(schoolId, req.body);

    res.status(201).json({
      success: true,
      message: "Timetable created successfully",
      data: timetable,
    });
  },
);

export const updateTimetableController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const timetableId = getParam(req.params.id);

    const timetable = await updateTimetable(schoolId, timetableId, req.body);

    res.status(200).json({
      success: true,
      message: "Timetable updated successfully",
      data: timetable,
    });
  },
);

export const deleteTimetableController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const timetableId = getParam(req.params.id);

    await deleteTimetable(schoolId, timetableId);

    res.status(200).json({
      success: true,
      message: "Timetable deleted successfully",
    });
  },
);

export const getPeriodsController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const periods = await getPeriods(schoolId);

    res.status(200).json({
      success: true,
      message: "Periods fetched successfully",
      data: periods,
    });
  },
);

export const savePeriodsController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const periods = await savePeriods(schoolId, req.body.periods);

    res.status(200).json({
      success: true,
      message: "Periods saved successfully",
      data: periods,
    });
  },
);

export const addPeriodController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const periods = await addPeriod(schoolId, req.body);

    res.status(201).json({
      success: true,
      message: "Period added successfully",
      data: periods,
    });
  },
);

export const deletePeriodController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const periodId = getParam(req.params.periodId);
    const periods = await deletePeriod(schoolId, periodId);

    res.status(200).json({
      success: true,
      message: "Period deleted successfully",
      data: periods,
    });
  },
);

export const upsertTimetableController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const timetable = await upsertTimetable(schoolId, req.body);

    res.status(200).json({
      success: true,
      message: "Timetable assigned successfully",
      data: timetable,
    });
  },
);

