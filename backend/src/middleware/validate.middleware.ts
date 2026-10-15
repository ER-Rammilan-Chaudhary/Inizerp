import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validate =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(422).json({
        success: false,
        message: "Validation Failed",
        errors: result.error.flatten(),
      });
    }

    req.body = result.data;

    next();
  };

export const validateQuery =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      return res.status(422).json({
        success: false,
        message: "Validation Failed",
        errors: result.error.flatten(),
      });
    }

    res.locals.validatedQuery = result.data;

    next();
  };

export const validateParams =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      return res.status(422).json({
        success: false,
        message: "Validation Failed",
        errors: result.error.flatten(),
      });
    }

    res.locals.validatedParams = result.data;

    next();
  };
