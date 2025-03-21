import React, { createContext, useContext, useState } from "react";

interface IAuthContext {
  accessToken: string;
  setAccessToken: (token: string) => void;
}

const AuthContext = createContext<IAuthContext>({
  accessToken: "",
  setAccessToken: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string>("");

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
