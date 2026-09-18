"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { loginApi } from "@/lib/api";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<"customer" | "model" | "partner">("customer");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    try {
      const response = await loginApi({ ...values, role });
      
      // Store token (Basic implementation, update based on your exact security needs)
      if (response.accessToken) {
        localStorage.setItem("accessToken", response.accessToken);
        localStorage.setItem("refreshToken", response.refreshToken);
        localStorage.setItem("userRole", role);
        
        // Redirect based on role
        if (role === "customer") router.push("/customer");
        else if (role === "model") router.push("/model");
        else if (role === "partner") router.push("/partner");
        else router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "Failed to log in. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="flex flex-col space-y-1.5 text-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Welcome back</h1>
        <p className="text-[13px] text-slate-500">
          Enter your credentials to access your account
        </p>
      </div>

      <SegmentedControl<"customer" | "model" | "partner">
        value={role}
        onChange={setRole}
        options={[
          { value: "customer", label: "Customer" },
          { value: "model", label: "Model" },
          { value: "partner", label: "Partner" },
        ]}
        className="mb-6"
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[13px] font-medium text-slate-700">Email address</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="name@example.com" 
                    {...field} 
                    className="h-11 border-slate-200/90 focus-visible:ring-2 focus-visible:ring-[#FF6433]/25 focus-visible:border-[#FF6433] rounded-xl bg-white text-[14px] shadow-2xs placeholder:text-slate-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="text-[13px] font-medium text-slate-700">Password</FormLabel>
                  <Link href="/forgot-password" className="text-[12px] font-medium text-[#FF6433] hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    {...field} 
                    className="h-11 border-slate-200/90 focus-visible:ring-2 focus-visible:ring-[#FF6433]/25 focus-visible:border-[#FF6433] rounded-xl bg-white text-[14px] shadow-2xs placeholder:text-slate-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {error && (
            <div className="p-3 text-[13px] text-rose-600 bg-rose-50 border border-rose-200/80 rounded-xl leading-relaxed">
              {error}
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="relative overflow-hidden w-full h-11 bg-gradient-to-b from-[#FF7A45] via-[#FF6433] to-[#E84A23] border border-white/35 rounded-full font-medium text-[14px] text-white flex items-center justify-center gap-2 shadow-[inset_0_1.5px_1.5px_rgba(255,255,255,0.7),inset_0_-2px_4px_rgba(0,0,0,0.15),0_8px_20px_rgba(232,74,35,0.25)] hover:brightness-105 active:scale-[0.985] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            <div className="absolute inset-x-2 top-0.5 h-[46%] bg-gradient-to-b from-white/70 via-white/20 to-transparent rounded-t-full pointer-events-none" />
            {isLoading && <Loader2 className="h-4 w-4 animate-spin text-white" />}
            <span>{isLoading ? "Signing in..." : "Sign In"}</span>
          </button>
        </form>
      </Form>

      <p className="text-center text-[13px] text-slate-500 pt-2">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-[#FF6433] hover:underline">
          Sign up
        </Link>
      </p>
    </>
  );
}
