import { env } from "./env";

export const jwtConfig = {
  accessSecret: env.JWT_ACCESS_SECRET,
  refreshSecret: env.JWT_REFRESH_SECRET,
  accessExpiresIn: env.ACCESS_EXPIRES_IN,
  refreshExpiresIn: env.REFRESH_EXPIRES_IN,
};
