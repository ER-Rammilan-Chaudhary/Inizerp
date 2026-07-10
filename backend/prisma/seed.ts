import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("admin123", 10);

  // SCHOOL
  let school = await prisma.school.findUnique({
    where: { slug: "demo-school" },
  });

  if (!school) {
    school = await prisma.school.create({
      data: {
        name: "Demo Public School",
        slug: "demo-school",
        code: "DPS001",
        email: "school@example.com",
        phone: "9999999999",
        address: "Delhi",
      },
    });
  }

  console.log("School:", school.name);

  // SUPER ADMIN (Global)
  const existingAdmin = await prisma.user.findUnique({
    where: { email: "admin@example.com" },
  });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        fullName: "Super Admin",
        email: "admin@example.com",
        password,
        role: Role.SUPER_ADMIN,
      },
    });

    console.log("Super Admin created");
  } else {
    console.log("Super Admin already exists");
  }

  // SCHOOL ADMIN
  const existingSchoolAdmin = await prisma.user.findUnique({
    where: { email: "schooladmin@example.com" },
  });

  if (!existingSchoolAdmin) {
    await prisma.user.create({
      data: {
        fullName: "School Admin",
        email: "schooladmin@example.com",
        password,
        role: Role.SCHOOL_ADMIN,

        // If your User model has schoolId relation
        schoolId: school.id,
      },
    });

    console.log("School Admin created");
  } else {
    console.log("School Admin already exists");
  }

  console.log("✅ Seed completed successfully");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
