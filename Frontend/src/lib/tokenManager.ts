class TokenManager {
  private token: string | undefined = "";
  private role: "user" | "admin" | null = null;

  getCurrentToken(): string | undefined {
    return this.token;
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
