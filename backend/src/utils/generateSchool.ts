import { prisma } from "../config/prisma";
import slugify from "slugify";

export async function generateSchoolData(name: string) {
  // Generate unique slug
  let slug = slugify(name, {
    lower: true,
    strict: true,
  });

  let counter = 1;

  while (await prisma.school.findUnique({ where: { slug } })) {
    slug = `${slugify(name, {
      lower: true,
      strict: true,
    })}-${counter++}`;
  }

  // Generate sequential school code
  const lastSchool = await prisma.school.findFirst({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      code: true,
    },
  });

  let nextNumber = 1;

  if (lastSchool?.code) {
    const num = parseInt(lastSchool.code.replace("SCH", ""), 10);

    if (!isNaN(num)) {
      nextNumber = num + 1;
    }
  }

  const code = `SCH${String(nextNumber).padStart(6, "0")}`;

  return {
    slug,
    code,
  };
}
