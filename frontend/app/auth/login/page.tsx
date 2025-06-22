"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store/user";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const setUser = useUserStore((s) => s.setUser);
  const router = useRouter();

  async function handleLogin() {
    try {
      const res = await fetch("http://localhost:1337/api/auth/local", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      if (!res.ok) throw new Error("Login failed");

      const data = await res.json();
      const { jwt, user } = data;

      setUser(user, jwt);
      router.push("/dashboard");
    } catch (err) {
      alert("Invalid credentials");
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Strapi Login</h2>
      <input
        className="border p-2 w-full mb-2"
        placeholder="Email or Username"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
      />
      <input
        className="border p-2 w-full mb-2"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleLogin}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Login
      </button>
    </div>
  );
}
