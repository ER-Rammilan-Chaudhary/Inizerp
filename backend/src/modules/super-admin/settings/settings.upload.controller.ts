// modules/settings/settings.upload.controller.ts

import { Request, Response, NextFunction } from "express";
import { updateSettingService } from "./settings.service";

export const uploadSettingFile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required",
      });
    }

    const { type } = req.body;

    if (type !== "logo" && type !== "favicon") {
      return res.status(400).json({
        success: false,
        message: "Invalid file type",
      });
    }

    const key = type === "logo" ? "site_logo" : "favicon";

    const schoolId = req.user?.schoolId ?? undefined;

    const fileUrl = `/uploads/${req.file.filename}`;

    const setting = await updateSettingService(key, fileUrl, schoolId);

    return res.status(200).json({
      success: true,
      message:
        type === "logo"
          ? "Logo uploaded successfully"
          : "Favicon uploaded successfully",
      data: {
        setting,
        url: fileUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};
