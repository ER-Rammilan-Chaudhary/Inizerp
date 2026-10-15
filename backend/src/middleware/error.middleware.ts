import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { ApiError } from "../utils/ApiError";
import { env } from "../config/env";

export const errorMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err);

  // Custom Error
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors ?? null,
    });
  }

  // Prisma Errors - Sanitized to prevent leaking database table/column details
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    let message = "A database error occurred";
    let statusCode = 400;

    switch (err.code) {
      case "P2002": {
        const target = Array.isArray(err.meta?.target)
          ? (err.meta.target as string[]).join(", ")
          : typeof err.meta?.target === "string"
            ? err.meta.target
            : "field";
        message = `A record with this ${target} already exists`;
        statusCode = 409;
        break;
      }
      case "P2025": {
        message = "Requested record was not found";
        statusCode = 404;
        break;
      }
      case "P2003": {
        message = "Operation failed due to related data constraints";
        statusCode = 400;
        break;
      }
      default: {
        message =
          env.NODE_ENV === "development"
            ? err.message
            : "Database operation failed";
        break;
      }
    }

    return res.status(statusCode).json({
      success: false,
      message,
    });
  }

  // Prisma Validation Error
  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      success: false,
      message:
        env.NODE_ENV === "development"
          ? err.message
          : "Invalid data provided for database operation",
    });
  }

  // Zod Errors
  if (err instanceof ZodError) {
    return res.status(422).json({
      success: false,
      message: "Validation Failed",
      errors: err.flatten(),
    });
  }

  // Unknown Error
  console.error("UNHANDLED ERROR in error.middleware:", err);
  const message =
    env.NODE_ENV === "development" && err instanceof Error
      ? err.message
      : "Internal Server Error";

  return res.status(500).json({
    success: false,
    message,
    ...(env.NODE_ENV === "development" &&
      err instanceof Error && { stack: err.stack }),
  });
};
