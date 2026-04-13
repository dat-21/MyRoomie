import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Role = "landlord" | "tenant" | "admin" | null;
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
    login: (email: string, password: string, role: Exclude<Role, null>) => Promise<boolean>;
    register: (data: UserData) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "myroomie_auth";
const DEMO_ADMIN_EMAIL = "admin@myroomie.vn";
const DEMO_ADMIN_PASSWORD = "admin123";

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

    const login = async (email: string, password: string, role: Exclude<Role, null>): Promise<boolean> => {
        // Mock admin login
        if (role === "admin") {
            if (email.toLowerCase() !== DEMO_ADMIN_EMAIL || password !== DEMO_ADMIN_PASSWORD) {
                return false;
            }

            setUser({
                email: DEMO_ADMIN_EMAIL,
                name: "Admin",
                role: "admin",
                status: "active",
            });
            return true;
        }

        // Mock login — check localStorage for existing registered user
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const userData: UserData = JSON.parse(stored);
            if (userData.email === email) {
                setUser({
                    ...userData,
                    role,
                    status: userData.status ?? "active",
                });
                return true;
            }
        }

        // Default demo login
        setUser({
            email,
            name: email.split("@")[0],
            role,
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
