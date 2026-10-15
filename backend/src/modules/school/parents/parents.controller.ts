import { Request, Response } from "express";
import {
  createParent,
  deleteParent,
  getParentById,
  getParents,
  updateParent,
} from "./parents.service";

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

export const getParentsController = async (req: Request, res: Response) => {
  const schoolId = getSchoolId(req);

  const parents = await getParents(schoolId);

  res.status(200).json({
    success: true,
    message: "Parents fetched successfully",
    data: parents,
  });
};

export const getParentByIdController = async (req: Request, res: Response) => {
  const schoolId = getSchoolId(req);
  const parentId = getParam(req.params.id);

  const parent = await getParentById(schoolId, parentId);

  res.status(200).json({
    success: true,
    message: "Parent fetched successfully",
    data: parent,
  });
};

export const createParentController = async (req: Request, res: Response) => {
  const schoolId = getSchoolId(req);

  const parent = await createParent(schoolId, req.body);

  res.status(201).json({
    success: true,
    message: "Parent created successfully",
    data: parent,
  });
};

export const updateParentController = async (req: Request, res: Response) => {
  const schoolId = getSchoolId(req);
  const parentId = getParam(req.params.id);

  const parent = await updateParent(schoolId, parentId, req.body);

  res.status(200).json({
    success: true,
    message: "Parent updated successfully",
    data: parent,
  });
};

export const deleteParentController = async (req: Request, res: Response) => {
  const schoolId = getSchoolId(req);
  const parentId = getParam(req.params.id);

  const result = await deleteParent(schoolId, parentId);

  res.status(200).json({
    success: true,
    message: "Parent deleted successfully",
    data: result,
  });
};
