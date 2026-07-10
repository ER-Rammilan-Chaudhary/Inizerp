import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/db.config";
import { JWT_SECRET } from "../config/jwt.config";

export const registerUser = async (
  fullName: string,
  email: string,
  password: string,
  role: any = "SCHOOL_ADMIN",
  schoolId?: string,) => {
  const hashed = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: { 
      fullName,
      email,
      password: hashed,
      role,
      schoolId: schoolId || null,
    },
  });
};

// 
export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) throw new Error("Invalid credentials");
  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid credentials");
  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
      schoolId: user.schoolId,
    },
    JWT_SECRET,
    { expiresIn: "1d" },
  );

  return { user, token };
};


// export const forgetPassword = async ()=>{
//  const user = await.prisma.user.findUnique({ where:{email},}) 

// }
