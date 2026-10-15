import { RoleEnum } from "@prisma/client";

export interface JwtPayload {
  userId: string;
  id: string;
  schoolId: string | null;
  role: RoleEnum;
}
