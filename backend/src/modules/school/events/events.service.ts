import { prisma } from "../../../config/prisma";
import { ApiError } from "../../../utils/ApiError";

const eventSelect = {
  id: true,
  schoolId: true,
  title: true,
  description: true,
  startDate: true,
  endDate: true,
  location: true,
  createdAt: true,
  updatedAt: true,
} as const;

type CreateEventData = {
  title: string;
  description?: string | null;
  startDate: Date;
  endDate?: Date | null;
  location?: string | null;
};

type UpdateEventData = {
  title?: string;
  description?: string | null;
  startDate?: Date;
  endDate?: Date | null;
  location?: string | null;
};

export const getEvents = async (schoolId: string) => {
  return prisma.event.findMany({
    where: {
      schoolId,
    },
    orderBy: {
      startDate: "asc",
    },
    select: eventSelect,
  });
};

export const getEventById = async (schoolId: string, eventId: string) => {
  const event = await prisma.event.findFirst({
    where: {
      id: eventId,
      schoolId,
    },
    select: eventSelect,
  });

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  return event;
};

export const createEvent = async (schoolId: string, data: CreateEventData) => {
  if (data.endDate && data.endDate < data.startDate) {
    throw new ApiError(400, "End date must be after or equal to start date");
  }

  return prisma.event.create({
    data: {
      schoolId,
      title: data.title,
      description: data.description ?? null,
      startDate: data.startDate,
      endDate: data.endDate ?? null,
      location: data.location ?? null,
    },
    select: eventSelect,
  });
};

export const updateEvent = async (
  schoolId: string,
  eventId: string,
  data: UpdateEventData,
) => {
  const existingEvent = await prisma.event.findFirst({
    where: {
      id: eventId,
      schoolId,
    },
  });

  if (!existingEvent) {
    throw new ApiError(404, "Event not found");
  }

  const startDate = data.startDate ?? existingEvent.startDate;

  const endDate =
    data.endDate !== undefined ? data.endDate : existingEvent.endDate;

  if (endDate && endDate < startDate) {
    throw new ApiError(400, "End date must be after or equal to start date");
  }

  return prisma.event.update({
    where: {
      id: eventId,
    },
    data: {
      title: data.title !== undefined ? data.title : existingEvent.title,

      description:
        data.description !== undefined
          ? data.description
          : existingEvent.description,

      startDate,

      endDate,

      location:
        data.location !== undefined ? data.location : existingEvent.location,
    },
    select: eventSelect,
  });
};

export const deleteEvent = async (schoolId: string, eventId: string) => {
  const event = await prisma.event.findFirst({
    where: {
      id: eventId,
      schoolId,
    },
    select: {
      id: true,
    },
  });

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  await prisma.event.delete({
    where: {
      id: eventId,
    },
  });

  return {
    id: eventId,
  };
};
