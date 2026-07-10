import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password, role, schoolId } = req.body;

    const user = await registerUser(fullName, email, password, role, schoolId);

    res.status(201).json(user);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const { user, token } = await loginUser(email, password);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "lax",
    });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        schoolId: user.schoolId,
      },
    });
  } catch (err: any) {
    res.status(401).json({ message: err.message });
  }
};

export const logout = (_: Request, res: Response) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};
