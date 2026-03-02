import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Role = "landlord" | "tenant" | null;
export type AccountStatus = "active" | "pending" | null;

export interface UserData {
    email: string;
    name: string;
    role: Role;
    status: AccountStatus;
    phone?: string;
    area?: string;
    rooms?: string;
    description?: string;
    budget?: string;
    intro?: string;
}

interface AuthContextType {
    user: UserData | null;
    isAuthenticated: boolean;
    isPending: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    register: (data: UserData) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "myroomie_auth";

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserData | null>(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    }, [user]);

    const login = async (email: string, _password: string): Promise<boolean> => {
        // Mock login — check localStorage for existing registered user
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const userData: UserData = JSON.parse(stored);
            if (userData.email === email) {
                setUser(userData);
                return true;
            }
        }
        // Default demo login
        setUser({
            email,
            name: email.split("@")[0],
            role: "tenant",
            status: "active",
        });
        return true;
    };

    const register = async (data: UserData): Promise<boolean> => {
        const newUser: UserData = {
            ...data,
            status: "pending",
        };
        setUser(newUser);
        return true;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem(STORAGE_KEY);
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
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
