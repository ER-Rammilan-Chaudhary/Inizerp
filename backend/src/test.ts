// import prisma from "./config/db.config";

// async function main() {
//   const name = "Test School";

//   await prisma.school.create({
//     data: {
//       name,
//       slug: name.toLowerCase().replace(/\s+/g, "-"),
//     },
//   });

//   const data = await prisma.school.findMany();
//   console.log(data);
// }

// main()
//   .catch(console.error)
//   .finally(() => prisma.$disconnect());
