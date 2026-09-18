"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const role = localStorage.getItem("userRole");

    if (!token) {
      router.replace("/login");
      return;
    }

    if (role === "partner") {
      router.replace("/partner");
    } else if (role === "model") {
      router.replace("/model");
    } else {
      router.replace("/customer");
    }
  }, [router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-black">
      <Loader2 className="h-8 w-8 animate-spin text-[#FF6433]" />
    </div>
  );
}
