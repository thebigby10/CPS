import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  id: number;
  username: string;
  email: string;
};

interface UserState {
  user: User | null;
  token: string | null;
  setUser: (user: User, token: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    { name: "auth-store" },
  ),
);
