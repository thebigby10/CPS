"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store/user";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useUserStore((s) => s.user);
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user) {
      router.push("/auth/login");
    }
  }, [user, router]);

  // Optionally show loading fallback
  if (!user) {
    return <div className="p-6">Checking authentication...</div>;
  }

  return <>{children}</>;
}
