import { Request, Response, NextFunction } from "express";
import {
  getAllFeatures,
  getFeatureByIdService,
  createFeatureService,
  updateFeatureService,
  deleteFeatureService,
  getFeatureCategoriesService,
  assignFeatureToSchool,
  getSchoolFeaturesService,
  bulkUpdateSchoolFeaturesService,
  toggleSchoolFeatureService,
  getFeatureStatisticsService,
  getFeatureUsageService,
  searchFeaturesService,
  removeFeatureFromSchoolService,
} from "./features.service";



export const getFeatures = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const search =
      typeof req.query.search === "string" ? req.query.search : undefined;

    const features = await getAllFeatures(search);

    return res.status(200).json({
      success: true,
      message: "Features fetched successfully.",
      data: features,
    });
  } catch (error) {
    next(error);
  }
};



export const getFeatureById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const feature = await getFeatureByIdService(String(req.params.id));

    return res.status(200).json({
      success: true,
      message: "Feature fetched successfully.",
      data: feature,
    });
  } catch (error) {
    next(error);
  }
};

export const createFeature = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const feature = await createFeatureService(req.body);

    return res.status(201).json({
      success: true,
      message: "Feature created successfully.",
      data: feature,
    });
  } catch (error) {
    next(error);
  }
};

export const updateFeature = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const feature = await updateFeatureService(String(req.params.id), req.body);

    return res.status(200).json({
      success: true,
      message: "Feature updated successfully.",
      data: feature,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteFeature = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await deleteFeatureService(String(req.params.id));

    return res.status(200).json({
      success: true,
      message: "Feature deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};




export const getFeatureCategories = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categories = await getFeatureCategoriesService();

    return res.status(200).json({
      success: true,
      message: "Categories fetched successfully.",
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

export const getSchoolFeatures = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const features = await getSchoolFeaturesService(String(req.params.schoolId),);

    return res.status(200).json({
      success: true,
      message: "School features fetched successfully.",
      data: features,
    });
  } catch (error) {
    next(error);
  }
};

export const assignFeature = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const feature = await assignFeatureToSchool(
      String(req.params.schoolId),
      req.body,
      req.user?.userId,
    );

    return res.status(201).json({
      success: true,
      message: "Feature assigned successfully.",
      data: feature,
    });
  } catch (error) {
    next(error);
  }
};

export const bulkUpdateSchoolFeatures = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const features = await bulkUpdateSchoolFeaturesService(
      String(req.params.schoolId),
      req.body.features,
    );

    return res.status(200).json({
      success: true,
      message: "School features updated successfully.",
      data: features,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleSchoolFeature = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const feature = await toggleSchoolFeatureService(
      String(req.params.schoolId),
      String(req.params.moduleId),
      req.body.enabled,
    );

    return res.status(200).json({
      success: true,
      message: "School feature updated successfully.",
      data: feature,
    });
  } catch (error) {
    next(error);
  }
};

export const removeFeatureFromSchool = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await removeFeatureFromSchoolService(
      String(req.params.schoolId),
      String(req.params.moduleId),
    );

    return res.status(200).json({
      success: true,
      message: "Feature removed from school successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const getFeatureStatistics = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await getFeatureStatisticsService();

    return res.status(200).json({
      success: true,
      message: "Feature statistics fetched successfully.",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getFeatureUsage = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await getFeatureUsageService();

    return res.status(200).json({
      success: true,
      message: "Feature usage fetched successfully.",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const searchFeatures = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await searchFeaturesService({
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      search: typeof req.query.search === "string" ? req.query.search : "",
      category:
        typeof req.query.category === "string" ? req.query.category : undefined,
      active:
        req.query.active === undefined
          ? undefined
          : req.query.active === "true",
    });

    return res.status(200).json({
      success: true,
      message: "Features fetched successfully.",
      data,
    });
  } catch (error) {
    next(error);
  }
};
