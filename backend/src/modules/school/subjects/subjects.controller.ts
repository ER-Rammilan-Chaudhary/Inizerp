import { NextFunction, Request, Response } from "express";
import { ApiError } from "../../../utils/ApiError";
import {
  createSubjectService,
  deleteSubjectService,
  getSubjectByIdService,
  getSubjectsService,
  updateSubjectService,
} from "./subjects.service";
import type { SubjectQuery } from "./subjects.schema";

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

export const getSubjects = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const schoolId = getSchoolId(req);
    const query = res.locals.validatedQuery as SubjectQuery;

    const result = await getSubjectsService(schoolId, query);

    return res.status(200).json({
      success: true,
      message: "Subjects fetched successfully",
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const getSubjectById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const schoolId = getSchoolId(req);
    const subjectId = getParam(req.params.id);

    const data = await getSubjectByIdService(schoolId, subjectId);

    return res.status(200).json({
      success: true,
      message: "Subject fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const createSubject = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const schoolId = getSchoolId(req);

    const data = await createSubjectService(schoolId, req.body);

    return res.status(201).json({
      success: true,
      message: "Subject created successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSubject = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const schoolId = getSchoolId(req);
    const subjectId = getParam(req.params.id);

    const data = await updateSubjectService(schoolId, subjectId, req.body);

    return res.status(200).json({
      success: true,
      message: "Subject updated successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSubject = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const schoolId = getSchoolId(req);
    const subjectId = getParam(req.params.id);

    await deleteSubjectService(schoolId, subjectId);

    return res.status(200).json({
      success: true,
      message: "Subject deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
