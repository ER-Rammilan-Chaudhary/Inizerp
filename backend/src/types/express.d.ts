import { JwtPayload } from "./auth.types";
import { TenantContext } from "./tenant.types";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
      tenant?: TenantContext;
    }
  }
}

export {};
