import { prisma } from "../../../config/prisma";
import { ApiError } from "../../../utils/ApiError";

const announcementSelect = {
  id: true,
  schoolId: true,
  title: true,
  message: true,
  createdAt: true,
  updatedAt: true,
  expiresAt: true,
  publishedAt: true,
} as const;

type CreateAnnouncementData = {
  title: string;
  message: string;
  expiresAt?: Date | null;
  publishedAt?: Date;
};

type UpdateAnnouncementData = {
  title?: string;
  message?: string;
  expiresAt?: Date | null;
  publishedAt?: Date;
};

export const getAnnouncements = async (schoolId: string) => {
  return prisma.announcement.findMany({
    where: {
      schoolId,
    },
    orderBy: {
      publishedAt: "desc",
    },
    select: announcementSelect,
  });
};

export const getAnnouncementById = async (
  schoolId: string,
  announcementId: string,
) => {
  const announcement = await prisma.announcement.findFirst({
    where: {
      id: announcementId,
      schoolId,
    },
    select: announcementSelect,
  });

  if (!announcement) {
    throw new ApiError(404, "Announcement not found");
  }

  return announcement;
};

export const createAnnouncement = async (
  schoolId: string,
  data: CreateAnnouncementData,
) => {
  const publishedAt = data.publishedAt ?? new Date();

  if (data.expiresAt && data.expiresAt < publishedAt) {
    throw new ApiError(
      400,
      "Expiry date must be after or equal to published date",
    );
  }

  return prisma.announcement.create({
    data: {
      schoolId,
      title: data.title,
      message: data.message,
      publishedAt,
      expiresAt: data.expiresAt ?? null,
    },
    select: announcementSelect,
  });
};

export const updateAnnouncement = async (
  schoolId: string,
  announcementId: string,
  data: UpdateAnnouncementData,
) => {
  const existing = await prisma.announcement.findFirst({
    where: {
      id: announcementId,
      schoolId,
    },
  });

  if (!existing) {
    throw new ApiError(404, "Announcement not found");
  }

  const publishedAt = data.publishedAt ?? existing.publishedAt;

  const expiresAt =
    data.expiresAt !== undefined ? data.expiresAt : existing.expiresAt;

  if (expiresAt && expiresAt < publishedAt) {
    throw new ApiError(
      400,
      "Expiry date must be after or equal to published date",
    );
  }

  return prisma.announcement.update({
    where: {
      id: announcementId,
    },
    data: {
      title: data.title !== undefined ? data.title : existing.title,

      message: data.message !== undefined ? data.message : existing.message,

      publishedAt,
      expiresAt,
    },
    select: announcementSelect,
  });
};

export const deleteAnnouncement = async (
  schoolId: string,
  announcementId: string,
) => {
  const announcement = await prisma.announcement.findFirst({
    where: {
      id: announcementId,
      schoolId,
    },
    select: {
      id: true,
    },
  });

  if (!announcement) {
    throw new ApiError(404, "Announcement not found");
  }

  await prisma.announcement.delete({
    where: {
      id: announcementId,
    },
  });

  return {
    id: announcementId,
  };
};
