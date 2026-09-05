"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/api/auth";
import { LogIn, User, ShoppingBag, Camera, Loader2, AlertCircle } from "lucide-react";

type Role = "customer" | "partner" | "model";

const ROLES: { value: Role; label: string; icon: React.ElementType; color: string; desc: string }[] = [
  { value: "customer", label: "Customer", icon: User, color: "bg-[#e1e0ff] text-[#4648d4] border-[#4648d4]", desc: "Access your bookings & points" },
  { value: "partner", label: "Partner", icon: ShoppingBag, color: "bg-emerald-50 text-emerald-700 border-emerald-500", desc: "Scan & manage your store" },
  { value: "model", label: "Model / Talent", icon: Camera, color: "bg-rose-50 text-rose-700 border-rose-500", desc: "Manage gigs & bookings" },
];

const PORTAL_ROUTES: Record<Role, string> = {
  customer: "/customer",
  partner: "/partner",
  model: "/model",
};

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await loginUser(email, password, role);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    router.push(PORTAL_ROUTES[role]);
  }

  const selectedRole = ROLES.find((r) => r.value === role)!;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] to-[#eef0ff] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#4648d4] mb-4 shadow-lg">
            <LogIn className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#0B1C30] tracking-tight">Island Monkey</h1>
          <p className="text-[#616161] text-sm mt-1">Sign in to your portal</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-[rgba(198,198,205,0.3)] p-6">
          {/* Role Selector */}
          <div className="mb-6">
            <p className="text-[12px] font-semibold text-[#616161] uppercase tracking-widest mb-3">
              I am a...
            </p>
            <div className="grid grid-cols-3 gap-2">
              {ROLES.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => { setRole(value); setError(""); }}
                  className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 text-center transition-all duration-150 ${
                    role === value
                      ? "border-[#4648d4] bg-[#e1e0ff]"
                      : "border-[rgba(198,198,205,0.4)] bg-slate-50 hover:border-[#4648d4]/40"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${role === value ? "text-[#4648d4]" : "text-[#616161]"}`} />
                  <span className={`text-[11px] font-semibold leading-tight ${role === value ? "text-[#4648d4]" : "text-[#45464D]"}`}>
                    {label}
                  </span>
                </button>
              ))}
            </div>
            <p className="text-[12px] text-[#bababa] mt-2 text-center">{selectedRole.desc}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#45464D]">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-[rgba(198,198,205,0.6)] bg-[#f8f9ff] text-[#0B1C30] text-[14px] placeholder:text-[#bababa] focus:outline-none focus:ring-2 focus:ring-[#4648d4]/30 focus:border-[#4648d4] transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#45464D]">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-[rgba(198,198,205,0.6)] bg-[#f8f9ff] text-[#0B1C30] text-[14px] placeholder:text-[#bababa] focus:outline-none focus:ring-2 focus:ring-[#4648d4]/30 focus:border-[#4648d4] transition-all"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-xl">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <p className="text-[13px] text-red-600 font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#4648d4] hover:bg-[#3a3cb8] text-white font-semibold text-[15px] rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-1"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</>
              ) : (
                <><LogIn className="w-4 h-4" /> Sign In</>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[12px] text-[#bababa] mt-6">
          Island Monkey Studio © 2026
        </p>
      </div>
    </div>
  );
}
