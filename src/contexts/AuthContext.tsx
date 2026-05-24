import { createContext, useContext, useState, type ReactNode } from "react";
import type { UserData, Role, AccountStatus } from "../types";
import * as authService from "../services/auth.service";

export type { Role, AccountStatus, UserData };

interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  isPending: boolean;
  login: (email: string, password: string, role: Exclude<Role, null>) => Promise<boolean>;
  register: (data: UserData, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(() =>
    authService.restoreSession()
  );

  const login = async (
    email: string,
    password: string,
    role: Exclude<Role, null>
  ): Promise<boolean> => {
    const result = await authService.login({ email, password, role });
    if (!result) return false;
    setUser(result);
    return true;
  };

  const register = async (data: UserData, password: string): Promise<boolean> => {
    const result = await authService.register(data, password);
    setUser(result);
    return true;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isPending: user?.status === "pending",
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
