import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { RoleEnum } from "@prisma/client";
import { jwtConfig } from "../config/jwt";

export interface JwtPayload {
  userId: string;
  id?: string;
  schoolId: string | null;
  role: RoleEnum;
}

const accessSecret: Secret = jwtConfig.accessSecret;
const refreshSecret: Secret = jwtConfig.refreshSecret;

export const generateAccessToken = (payload: JwtPayload) => {
  const options: SignOptions = {
    expiresIn: jwtConfig.accessExpiresIn as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, accessSecret, options);
};

export const generateRefreshToken = (payload: JwtPayload) => {
  const options: SignOptions = {
    expiresIn: jwtConfig.refreshExpiresIn as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, refreshSecret, options);
};

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, accessSecret) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, refreshSecret) as JwtPayload;
};
