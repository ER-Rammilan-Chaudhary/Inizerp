import { Request, Response } from "express";
import * as service from "./settings.service";

export const getSettings = async (_req: Request, res: Response) => {
  const data = await service.getSettingsService();

  return res.status(200).json({
    success: true,
    message: "Settings fetched successfully",
    data,
  });
};

export const getSettingByKey = async (
  req: Request<{ key: string }>,
  res: Response,
) => {
  const data = await service.getSettingByKeyService(req.params.key);

  if (!data) {
    return res.status(404).json({
      success: false,
      message: "Setting not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Setting fetched successfully",
    data,
  });
};

export const createOrUpdateSetting = async (req: Request, res: Response) => {
  const { key, value } = req.body;

  const data = await service.createOrUpdateSettingService(key, value);

  return res.status(200).json({
    success: true,
    message: "Setting saved successfully",
    data,
  });
};

export const updateSetting = async (
  req: Request<{ key: string }>,
  res: Response,
) => {
  try {
    const data = await service.updateSettingService(
      req.params.key,
      req.body.value,
    );

    return res.status(200).json({
      success: true,
      message: "Setting updated successfully",
      data,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Setting not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    throw error;
  }
};

export const deleteSetting = async (
  req: Request<{ key: string }>,
  res: Response,
) => {
  try {
    const data = await service.deleteSettingService(req.params.key);

    return res.status(200).json({
      success: true,
      message: "Setting deleted successfully",
      data,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Setting not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    throw error;
  }
};
