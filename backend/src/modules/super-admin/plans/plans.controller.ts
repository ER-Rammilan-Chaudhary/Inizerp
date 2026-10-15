import { Request, Response, NextFunction } from "express";
import { ApiError } from "../../../utils/ApiError";

import {
  createPlanService,
  getPlansService,
  getPlanByIdService,
  updatePlanService,
  deletePlanService,
  updatePlanStatusService,
  getPlanModulesService,
  assignPlanModuleService,
  removePlanModuleService,
  bulkAssignPlanModulesService,
} from "./plans.service";

export const createPlan = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const plan = await createPlanService(req.body);

    return res.status(201).json({
      success: true,
      message: "Plan created successfully",
      data: plan,
    });
  } catch (error) {
    next(error);
  }
};

export const getPlans = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const search = String(req.query.search ?? "");

    const plans = await getPlansService(page, limit, search);

    return res.status(200).json({
      success: true,
      message: "Plans fetched successfully",
      data: plans,
    });
  } catch (error) {
    next(error);
  }
};

export const getPlanById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const plan = await getPlanByIdService(String(req.params.id));

    return res.status(200).json({
      success: true,
      message: "Plan fetched successfully",
      data: plan,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePlan = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const plan = await updatePlanService(String(req.params.id), req.body);

    return res.status(200).json({
      success: true,
      message: "Plan updated successfully",
      data: plan,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePlanStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      throw new ApiError(400, "isActive must be true or false");
    }

    const plan = await updatePlanStatusService(String(req.params.id), isActive);

    return res.status(200).json({
      success: true,
      message: "Plan status updated successfully",
      data: plan,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePlan = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await deletePlanService(String(req.params.id));

    return res.status(200).json({
      success: true,
      message: "Plan deactivated successfully",
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| PLAN MODULES
|--------------------------------------------------------------------------
*/

export const getPlanModules = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const modules = await getPlanModulesService(String(req.params.id));

    return res.status(200).json({
      success: true,
      message: "Plan modules fetched successfully",
      data: modules,
    });
  } catch (error) {
    next(error);
  }
};

export const assignPlanModule = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await assignPlanModuleService(
      String(req.params.id),
      req.body,
    );

    return res.status(201).json({
      success: true,
      message: "Module assigned to plan successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const removePlanModule = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await removePlanModuleService(
      String(req.params.id),
      String(req.params.moduleId),
    );

    return res.status(200).json({
      success: true,
      message: "Module removed from plan successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const bulkAssignPlanModules = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const modules = await bulkAssignPlanModulesService(
      String(req.params.id),
      req.body,
    );

    return res.status(200).json({
      success: true,
      message: "Plan modules updated successfully",
      data: modules,
    });
  } catch (error) {
    next(error);
  }
};
