import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userRepository from "../repositories/user.repository";
import { LoginUser } from "../../../types/user";

class AuthService {

  async login({ email, password }: LoginUser) {
    {
      try {
        const user = await userRepository.findOneByEmail(email);

        if (!user) throw new Error("User not found");

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) throw new Error("Invalid password");

        const token = jwt.sign(
          { email: user.email, role: user.role },
          process.env.JWT_SECRET as string,
          { expiresIn: "1h" }
        );
        
        return { token };
      } catch (error) {
        throw error;
      }
    }
  }


}

export default new AuthService();