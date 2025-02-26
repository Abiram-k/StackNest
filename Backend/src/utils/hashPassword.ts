import bcrypt from "bcrypt";

export const hashPassword = async (password: string) => {
  try {
    const salt = 10;
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw error;
  }
};
