import { Request, Response } from "express";

import { asyncHandler } from "../../../utils/asyncHandler";

import {
  getAcademicYearsService,
  getCurrentAcademicYearService,
  getAcademicYearByIdService,
  createAcademicYearService,
  updateAcademicYearService,
  setCurrentAcademicYearService,
  deleteAcademicYearService,
} from "./academic-years.service";

const getSchoolId = (req: Request): string => {
  const schoolId = req.tenant?.schoolId;

  if (!schoolId) {
    throw new Error("School context is required");
  }

  return schoolId;
};

const getParam = (value: string | string[] | undefined): string => {
  if (typeof value !== "string") {
    throw new Error("Invalid route parameter");
  }

  return value;
};

export const getAcademicYears = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);

    const data = await getAcademicYearsService(schoolId);

    res.status(200).json({
      success: true,
      message: "Academic years fetched successfully",
      data,
    });
  },
);

export const getCurrentAcademicYear = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);

    const data = await getCurrentAcademicYearService(schoolId);

    if (!data) {
      res.status(404).json({
        success: false,
        message: "Current academic year not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Current academic year fetched successfully",
      data,
    });
  },
);

export const getAcademicYearById = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const id = getParam(req.params.id);

    const data = await getAcademicYearByIdService(schoolId, id);

    if (!data) {
      res.status(404).json({
        success: false,
        message: "Academic year not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Academic year fetched successfully",
      data,
    });
  },
);

export const createAcademicYear = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);

    const data = await createAcademicYearService(schoolId, req.body);

    res.status(201).json({
      success: true,
      message: "Academic year created successfully",
      data,
    });
  },
);

export const updateAcademicYear = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const id = getParam(req.params.id);

    const data = await updateAcademicYearService(schoolId, id, req.body);

    res.status(200).json({
      success: true,
      message: "Academic year updated successfully",
      data,
    });
  },
);

export const setCurrentAcademicYear = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const id = getParam(req.params.id);

    const data = await setCurrentAcademicYearService(schoolId, id);

    res.status(200).json({
      success: true,
      message: "Current academic year updated successfully",
      data,
    });
  },
);

export const deleteAcademicYear = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const id = getParam(req.params.id);

    const data = await deleteAcademicYearService(schoolId, id);

    res.status(200).json({
      success: true,
      message: "Academic year deleted successfully",
      data,
    });
  },
);
