import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// 1. Bcrypt functions

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const comparePassword = async (password, hashPath) => {
  return await bcrypt.compare(password, hashPath);
};

// 2. JWT function

const generateToken = async (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

export { hashPassword, comparePassword, generateToken };
