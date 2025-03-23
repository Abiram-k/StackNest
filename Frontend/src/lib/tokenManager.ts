import { refreshAccessToken } from "@/api/apiSevice";

class TokenManager {
  private token: string | undefined = "";
  private role: "user" | "admin" | null = null;

  getCurrentToken(): string | undefined {
    return this.token;
  }
  async refreshAccessToken(): Promise<string | undefined> {
    const token = await refreshAccessToken("user");
    this.token = token;
    return token;
  }
  getCurrentRole(): "user" | "admin" | null {
    return this.role;
  }
  updateToken(newToken: string | undefined, role: "user" | "admin") {
    this.token = newToken;
    this.role = role;
  }
  clearToken() {
    this.token = "";
    this.role = null;
  }
}

export const tokenManager = new TokenManager();
