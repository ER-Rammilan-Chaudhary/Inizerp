import { Request, Response } from "express";

import { asyncHandler } from "../../../utils/asyncHandler";

import {
  createClass,
  createSection,
  deleteClass,
  deleteSection,
  getClassById,
  getClasses,
  getSections,
  updateClass,
  updateSection,
} from "./classes.service";

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

export const getClassesController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);

    const classes = await getClasses(schoolId, req.query);

    res.status(200).json({
      success: true,
      message: "Classes fetched successfully",
      data: classes,
    });
  },
);

export const getClassByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const classId = getParam(req.params.id);

    const classRecord = await getClassById(schoolId, classId);

    res.status(200).json({
      success: true,
      message: "Class fetched successfully",
      data: classRecord,
    });
  },
);

export const createClassController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);

    const classRecord = await createClass(schoolId, req.body);

    res.status(201).json({
      success: true,
      message: "Class created successfully",
      data: classRecord,
    });
  },
);

export const updateClassController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const classId = getParam(req.params.id);

    const classRecord = await updateClass(schoolId, classId, req.body);

    res.status(200).json({
      success: true,
      message: "Class updated successfully",
      data: classRecord,
    });
  },
);

export const deleteClassController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const classId = getParam(req.params.id);

    const result = await deleteClass(schoolId, classId);

    res.status(200).json({
      success: true,
      message: "Class deleted successfully",
      data: result,
    });
  },
);

export const getSectionsController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const classId = getParam(req.params.classId);

    const sections = await getSections(schoolId, classId);

    res.status(200).json({
      success: true,
      message: "Sections fetched successfully",
      data: sections,
    });
  },
);

export const createSectionController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const classId = getParam(req.params.classId);

    const section = await createSection(schoolId, classId, req.body);

    res.status(201).json({
      success: true,
      message: "Section created successfully",
      data: section,
    });
  },
);

export const updateSectionController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const classId = getParam(req.params.classId);
    const sectionId = getParam(req.params.sectionId);

    const section = await updateSection(schoolId, classId, sectionId, req.body);

    res.status(200).json({
      success: true,
      message: "Section updated successfully",
      data: section,
    });
  },
);

export const deleteSectionController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const classId = getParam(req.params.classId);
    const sectionId = getParam(req.params.sectionId);

    const result = await deleteSection(schoolId, classId, sectionId);

    res.status(200).json({
      success: true,
      message: "Section deleted successfully",
      data: result,
    });
  },
);
