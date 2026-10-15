import { Request, Response, NextFunction } from "express";
import { SchoolStatus } from "@prisma/client";
import { ApiError } from "../../../utils/ApiError";
import {
  createSchoolService,
  getSchoolsService,
  getSchoolByIdService,
  updateSchoolService,
  deleteSchoolService,
  updateSchoolStatusService,
  updateSchoolAdminService,
  resetSchoolAdminPasswordService,
  getSchoolAdminService,
} from "./schools.service";

export const createSchool = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const school = await createSchoolService(req.body, req.file);

    return res.status(201).json({
      success: true,
      message: "School created successfully",
      data: school,
    });
  } catch (error) {
    next(error);
  }
};

export const getSchools = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search =
      typeof req.query.search === "string" ? req.query.search : undefined;

    const result = await getSchoolsService(page, limit, search);

    return res.status(200).json({
      success: true,
      message: "Schools fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getSchoolById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const schoolId = String(req.params.id);

    if (!schoolId) {
      throw new ApiError(400, "School ID is required");
    }

    const school = await getSchoolByIdService(schoolId);

    return res.status(200).json({
      success: true,
      message: "School fetched successfully",
      data: school,
    });
  } catch (error) {
    next(error);
  }
};

export const getSchoolBymodules = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const schoolId = String(req.params.id);

    if (!schoolId) {
      throw new ApiError(400, "School ID is required");
    }

    const school = await getSchoolByIdService(schoolId);

    return res.status(200).json({
      success: true,
      message: "School fetched successfully",
      data: school.modules,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSchool = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const schoolId = String(req.params.id);

    if (!schoolId) {
      throw new ApiError(400, "School ID is required");
    }

    const school = await updateSchoolService(schoolId, req.body, req.file);

    return res.status(200).json({
      success: true,
      message: "School updated successfully",
      data: school,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSchoolStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const schoolId = String(req.params.id);
    const status = req.body.status as SchoolStatus;

    if (!schoolId) {
      throw new ApiError(400, "School ID is required");
    }

    if (!status) {
      throw new ApiError(400, "School status is required");
    }

    if (!Object.values(SchoolStatus).includes(status)) {
      throw new ApiError(400, "Invalid school status");
    }

    const school = await updateSchoolStatusService(schoolId, status);

    return res.status(200).json({
      success: true,
      message: "School status updated successfully",
      data: school,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSchool = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const schoolId = String(req.params.id);

    if (!schoolId) {
      throw new ApiError(400, "School ID is required");
    }

    const school = await deleteSchoolService(schoolId);

    return res.status(200).json({
      success: true,
      message: "School deleted successfully",
      data: school,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSchoolAdminController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const schoolId = String(req.params.id);

    if (!schoolId) {
      throw new ApiError(400, "School ID is required");
    }

    const admin = await updateSchoolAdminService(schoolId, req.body);

    return res.status(200).json({
      success: true,
      message: "School admin updated successfully",
      data: admin,
    });
  } catch (error) {
    next(error);
  }
};

export const resetSchoolAdminPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const schoolId = String(req.params.id);
    const { password } = req.body;

    if (!schoolId) {
      throw new ApiError(400, "School ID is required");
    }

    if (!password) {
      throw new ApiError(400, "Password is required");
    }

    const result = await resetSchoolAdminPasswordService(schoolId, password);

    return res.status(200).json({
      success: true,
      message: "School admin password reset successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getSchoolAdminController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const schoolId = String(req.params.id);

    if (!schoolId) {
      throw new ApiError(400, "School ID is required");
    }

    const admin = await getSchoolAdminService(schoolId);

    return res.status(200).json({
      success: true,
      message: "School admin fetched successfully",
      data: admin,
    });
  } catch (error) {
    next(error);
  }
};
