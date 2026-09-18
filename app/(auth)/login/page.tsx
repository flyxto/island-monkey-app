"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
      <div className="flex flex-col space-y-2 text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-[#0B1C30]">Welcome back</h1>
        <p className="text-sm text-[#616161]">
          Enter your email to sign in to your account
        </p>
      </div>

      <Tabs defaultValue="customer" className="w-full mb-8" onValueChange={(v) => setRole(v as any)}>
        <TabsList className="grid w-full grid-cols-3 p-1 bg-[#fdf2ea] rounded-xl h-auto">
          <TabsTrigger 
            value="customer" 
            className="rounded-lg py-2 data-[state=active]:bg-[#C85A17] data-[state=active]:text-white data-[state=active]:shadow-sm transition-all text-[#616161]"
          >
            Customer
          </TabsTrigger>
          <TabsTrigger 
            value="model" 
            className="rounded-lg py-2 data-[state=active]:bg-[#C85A17] data-[state=active]:text-white data-[state=active]:shadow-sm transition-all text-[#616161]"
          >
            Model
          </TabsTrigger>
          <TabsTrigger 
            value="partner" 
            className="rounded-lg py-2 data-[state=active]:bg-[#0B1C30] data-[state=active]:text-white data-[state=active]:shadow-sm transition-all text-[#616161]"
          >
            Partner
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#0B1C30]">Email</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="name@example.com" 
                    {...field} 
                    className="h-12 border-[#c6c6cd] focus-visible:ring-[#C85A17] rounded-xl bg-white"
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
                  <FormLabel className="text-[#0B1C30]">Password</FormLabel>
                  <Link href="/forgot-password" className="text-sm font-medium text-[#C85A17] hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    {...field} 
                    className="h-12 border-[#c6c6cd] focus-visible:ring-[#C85A17] rounded-xl bg-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full h-12 text-base font-semibold bg-[#000000] hover:bg-[#000000]/90 text-white rounded-xl shadow-sm transition-all"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            Sign In
          </Button>
        </form>
      </Form>

      <p className="px-8 text-center text-sm text-[#616161] mt-8">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-[#C85A17] hover:underline">
          Sign up
        </Link>
      </p>
    </>
  );
}
