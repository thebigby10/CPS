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
  ) => Promise<boolean>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) return;

    fetch("http://localhost:1337/api/users/me?populate=role", {
      credentials: "include",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return;
        setUser({
          id: data.id,
          username: data.username,
          email: data.email,
          role: data.role?.type || "normal_user",
        });
      })
      .catch((err) => {
        console.error("Failed to fetch user", err);
      });
  }, []);

  const getCurrentUserRoleType = async () => {
    try {
      const jwt = localStorage.getItem("jwt");
      if (!jwt) return "public";

      const response = await fetch(
        "http://localhost:1337/api/users/me?populate=role",
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          credentials: "include",
        },
      );

      if (!response.ok) {
        return "public";
      }

      const userData = await response.json();
      return userData.role?.type || "public";
    } catch (error) {
      return "public";
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    const res = await fetch("http://localhost:1337/api/auth/local/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ identifier: email, password }),
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("jwt", data.jwt);

      setUser({
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
        role: await getCurrentUserRoleType(),
      });

      return true;
    }

    return false;
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem("jwt");
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
      const data = await res.json();
      localStorage.setItem("jwt", data.jwt);

      setUser({
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
        role: await getCurrentUserRoleType(),
      });

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
