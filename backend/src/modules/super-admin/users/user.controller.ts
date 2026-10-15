import { Request, Response, NextFunction } from "express";

import {
  getUsers,
  getUserByIdService,
  createSchoolAdmin,
  updateSchoolAdmin,
  deleteSchoolAdmin,
  resetSchoolAdminPassword,
} from "./user.service";

// GET ALL USERS
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await getUsers(req.query as Record<string, string>);

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

// GET USER BY ID
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid user id",
      });
    }

    const user = await getUserByIdService(id);

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// CREATE SCHOOL ADMIN
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const avatar = req.file ? `/uploads/users/${req.file.filename}` : null;

    const user = await createSchoolAdmin({
      ...req.body,
      avatar,
    });

    return res.status(201).json({
      success: true,
      message: "School Admin created successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE SCHOOL ADMIN
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid user id",
      });
    }

    const avatar = req.file ? `/uploads/users/${req.file.filename}` : undefined;

    const user = await updateSchoolAdmin(id, {
      ...req.body,
      ...(avatar !== undefined && {
        avatar,
      }),
    });

    return res.status(200).json({
      success: true,
      message: "School Admin updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE SCHOOL ADMIN
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "User id is required",
      });
    }

    await deleteSchoolAdmin(id);

    return res.status(200).json({
      success: true,
      message: "School Admin deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// RESET PASSWORD
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "User id is required",
      });
    }

    await resetSchoolAdminPassword(id, req.body);

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    next(error);
  }
};
