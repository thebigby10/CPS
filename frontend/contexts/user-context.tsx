"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { User } from "@/lib/types";

interface UserContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
    role: "normal_user" | "social_media_manager" | "student",
  ) => Promise<boolean>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch("http://localhost:1337/api/users/me", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data && setUser(data))
      .catch(() => {});
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const res = await fetch("http://localhost:1337/api/auth/local/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // for cookies if using session auth
      body: JSON.stringify({ identifier: email, password }),
    });

    if (res.ok) {
      const userData = await res.json();
      setUser(userData);
      return true;
    }

    return false;
  };

  const logout = async () => {
    setUser(null);
  };

  const register = async (
    username: string,
    email: string,
    password: string,
  ): Promise<boolean> => {
    const res = await fetch("http://localhost:1337/api/auth/local/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, email, password }),
    });

    if (res.ok) {
      // console.log(res);
      const userData = await res.json();
      setUser(userData);
      return true;
    }

    return false;
  };

  return (
    <UserContext.Provider value={{ user, login, logout, register }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
