import { prisma } from "../../config/prisma";

export class AuthRepository {
  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async updateLastLogin(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        lastLoginAt: new Date(),
        failedLogins: 0,
        lockedUntil: null,
      },
    });
  }

  async saveRefreshToken(
    userId: string,
    schoolId: string | null,
    tokenHash: string,
    expiresAt: Date,
  ) {
    return prisma.refreshToken.create({
      data: {
        userId,
        schoolId,
        tokenHash,
        expiresAt,
      },
    });
  }

  async deleteRefreshToken(tokenHash: string) {
    return prisma.refreshToken.deleteMany({
      where: {
        tokenHash,
      },
    });
  }

  async findRefreshToken(tokenHash: string) {
    return prisma.refreshToken.findUnique({
      where: {
        tokenHash,
      },
    });
  }
}

export const authRepository = new AuthRepository();
