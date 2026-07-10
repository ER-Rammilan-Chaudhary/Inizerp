import { FEATURES } from "../constants/features";
import { SchoolRepository } from "../repositories/school.repository";
import { CreateSchoolDto, UpdateSchoolDto } from "../types/school.types";
import { generateSlug } from "../utils/slug";

const schoolRepository = new SchoolRepository();

export const createSchool = async (payload: CreateSchoolDto) => {
  const slug = generateSlug(payload.name);

  const existingSchool = await schoolRepository.findExisting(
    slug,
    payload.email,
  );

  if (existingSchool) {
    throw new Error("School already exists.");
  }

  const startDate = new Date();

  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 30);

  return schoolRepository.transaction(async (repository) => {
    const school = await repository.createSchool({
      code: payload.code,
      name: payload.name,
      slug,

      email: payload.email,
      phone: payload.phone,
      address: payload.address,
      logo: payload.logo,

      principal: payload.principal,

      primaryColor: payload.primaryColor,
      secondaryColor: payload.secondaryColor,

      slogan: payload.slogan,

      missionStatement: payload.missionStatement,
      visionStatement: payload.visionStatement,

      startHour: payload.startHour,
      closeHour: payload.closeHour,
    });

    await repository.createFeatures(
      FEATURES.map((feature) => ({
        schoolId: school.id,
        featureKey: feature.key,
        enabled: feature.defaultEnabled,
      })),
    );

    await repository.createSubscription({
      school: {
        connect: {
          id: school.id,
        },
      },

      planName: "FREE_TRIAL",

      status: "ACTIVE",

      startDate,

      endDate,

      maxStudents: 100,

      maxTeachers: 20,
    });

    return school;
  });
};

export const getSchools = async (page = 1, limit = 10, search?: string) => {
  return schoolRepository.findAll({
    page,
    limit,
    search,
  });
};

export const getSchoolById = async (id: string) => {
  const school = await schoolRepository.findById(id);

  if (!school) {
    throw new Error("School not found.");
  }

  return school;
};

export const updateSchool = async (id: string, payload: UpdateSchoolDto) => {
  const school = await schoolRepository.findById(id);

  if (!school) {
    throw new Error("School not found.");
  }

  const data = {
    ...payload,
  };

  if (payload.name && payload.name !== school.name) {
    const slug = generateSlug(payload.name);

    const existing = await schoolRepository.findExisting(slug);

    if (existing && existing.id !== id) {
      throw new Error("School name already exists.");
    }

    Object.assign(data, {
      slug,
    });
  }

  return schoolRepository.updateSchool(id, data);
};

export const deleteSchool = async (id: string) => {
  const school = await schoolRepository.findById(id);

  if (!school) {
    throw new Error("School not found.");
  }

  await schoolRepository.deleteSchool(id);

  return {
    message: "School deleted successfully.",
  };
};
