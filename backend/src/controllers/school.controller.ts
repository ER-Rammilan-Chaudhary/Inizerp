import { Request, Response } from "express";
import * as schoolService from "../services/school.service";

interface SchoolParams {
  id: string;
}

interface GetSchoolsQuery {
  page?: string;
  limit?: string;
  search?: string;
}

export const createSchool = async (req: Request, res: Response) => {
  try {
    const school = await schoolService.createSchool(req.body);

    return res.status(201).json({
      success: true,
      message: "School created successfully.",
      data: school,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong.",
    });
  }
};

export const getSchools = async (
  req: Request<{}, {}, {}, GetSchoolsQuery>,
  res: Response,
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search;

    const schools = await schoolService.getSchools(page, limit, search);

    return res.status(200).json({
      success: true,
      message: "Schools fetched successfully.",
      data: schools,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong.",
    });
  }
};

export const getSchoolById = async (
  req: Request<SchoolParams>,
  res: Response,
) => {
  try {
    const school = await schoolService.getSchoolById(req.params.id);

    return res.status(200).json({
      success: true,
      message: "School fetched successfully.",
      data: school,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong.",
    });
  }
};

export const updateSchool = async (
  req: Request<SchoolParams>,
  res: Response,
) => {
  try {
    const school = await schoolService.updateSchool(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      message: "School updated successfully.",
      data: school,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong.",
    });
  }
};

export const deleteSchool = async (
  req: Request<SchoolParams>,
  res: Response,
) => {
  try {
    const result = await schoolService.deleteSchool(req.params.id);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong.",
    });
  }
};
