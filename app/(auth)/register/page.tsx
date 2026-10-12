"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Loader2,
  ArrowLeft,
  Check,
} from "lucide-react";

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
import { WheelDatePickerModal } from "@/components/ui/wheel-date-picker";
import { registerApi } from "@/lib/api";

const DISCIPLINES = [
  "Fashion",
  "Commercial",
  "Runway",
  "Editorial",
  "Beauty & Glamour",
  "Fitness",
  "Swimwear",
  "Lifestyle",
  "Parts & Hand",
  "Promotional",
] as const;

const formSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().optional(),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<"customer" | "model">("customer");
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Model-specific onboarding fields (Step 2 & 3)
  const [dateOfBirth, setDateOfBirth] = useState<string>("");
  const [gender, setGender] = useState<string>("Female");
  const [origin, setOrigin] = useState<string>("Sri Lankan");
  const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>([
    "Fashion",
    "Commercial",
  ]);

  // iOS-style Wheel Date Picker Modal State
  const [isWheelPickerOpen, setIsWheelPickerOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  const toggleDiscipline = (item: string) => {
    setSelectedDisciplines((prev) =>
      prev.includes(item) ? prev.filter((d) => d !== item) : [...prev, item]
    );
  };

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-").map(Number);
    if (parts.length !== 3) return dateStr;
    const d = new Date(parts[0], parts[1] - 1, parts[2]);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleRegister = async (includeModelSpecs: boolean) => {
    setIsLoading(true);
    setError(null);
    try {
      const accountValues = form.getValues();
      const payload: any = {
        ...accountValues,
        role,
      };

      if (role === "model" && includeModelSpecs) {
        if (dateOfBirth) payload.dateOfBirth = dateOfBirth;
        payload.gender = gender;
        payload.origin = origin;
        payload.modelingType = selectedDisciplines;
      }

      const response = await registerApi(payload);

      // Store tokens
      if (response.accessToken) {
        localStorage.setItem("accessToken", response.accessToken);
        localStorage.setItem("refreshToken", response.refreshToken);
        localStorage.setItem("userRole", role);

        // Redirect based on role
        if (role === "customer") router.push("/customer");
        else if (role === "model") router.push("/model");
        else router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async () => {
    if (role === "model" && step === 1) {
      // Proceed to Step 2 for model details
      setStep(2);
      return;
    }

    // Direct submit for customer
    await handleRegister(role === "model");
  };

  return (
    <>
      {/* ─── STEP 1: CREDENTIALS & ROLE SELECTION ─── */}
      {step === 1 && (
        <>
          <div className="flex flex-col space-y-1.5 text-center mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create an account</h1>
            <p className="text-[13px] text-slate-500">
              Join Island Monkey to book or showcase talent
            </p>
          </div>

          <SegmentedControl<"customer" | "model">
            value={role}
            onChange={(r) => {
              setRole(r);
              setStep(1);
            }}
            options={[
              { value: "customer", label: "Customer" },
              { value: "model", label: "Model" },
            ]}
            className="mb-6"
          />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[13px] font-medium text-slate-700">First Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John"
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
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[13px] font-medium text-slate-700">Last Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Doe"
                          {...field}
                          className="h-11 border-slate-200/90 focus-visible:ring-2 focus-visible:ring-[#FF6433]/25 focus-visible:border-[#FF6433] rounded-xl bg-white text-[14px] shadow-2xs placeholder:text-slate-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[13px] font-medium text-slate-700">Email address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
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
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[13px] font-medium text-slate-700">Phone <span className="text-[12px] font-normal text-slate-400">(Optional)</span></FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="+94 77 123 4567"
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
                    <FormLabel className="text-[13px] font-medium text-slate-700">Password</FormLabel>
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
                <span>
                  {isLoading
                    ? "Creating account..."
                    : role === "model"
                    ? "Continue to Model Details"
                    : "Create Account"}
                </span>
              </button>
            </form>
          </Form>

          <p className="text-center text-[13px] text-slate-500 pt-2">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[#FF6433] hover:underline">
              Sign in
            </Link>
          </p>
        </>
      )}

      {/* ─── STEP 2: MODEL DEMOGRAPHICS & DOB (OPTIONAL / SKIPPABLE) ─── */}
      {step === 2 && (
        <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1.5 text-[12px] font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <span className="text-[13px] font-semibold text-[#FF6433]">
              Step 2 of 3
            </span>
          </div>

          <div className="flex flex-col space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Model Demographics</h1>
            <p className="text-[13px] text-slate-500">
              Basic casting details. You can skip now and fill specs later in settings.
            </p>
          </div>

          <div className="space-y-4 pt-1">
            {/* iOS-Style 3-Column Spinning Wheel Date Picker Trigger */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-slate-700 block">
                Date of Birth{" "}
                <span className="text-[12px] font-normal text-slate-400">
                  (Required for casting age bracket)
                </span>
              </label>
              <button
                type="button"
                onClick={() => setIsWheelPickerOpen(true)}
                className="w-full h-11 px-3.5 bg-white border border-slate-200/90 rounded-xl text-[14px] flex items-center text-left hover:border-slate-300 transition-colors shadow-2xs cursor-pointer"
              >
                <span className={dateOfBirth ? "text-slate-900 font-medium" : "text-slate-400 font-normal"}>
                  {dateOfBirth ? formatDisplayDate(dateOfBirth) : "Select your date of birth"}
                </span>
              </button>
            </div>

            {/* Gender / Division (All buttons fully rounded) */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-slate-700 block">
                Division / Gender
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["Female", "Male", "Non-Binary"] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    className={`h-10 rounded-full text-[13px] font-medium transition-all cursor-pointer border ${
                      gender === g
                        ? "bg-[#FDF2EA] text-[#C85A17] border-[#F3DAC9] font-semibold shadow-2xs"
                        : "bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Origin (All buttons fully rounded) */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-slate-700 block">
                Origin Division
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(["Sri Lankan", "Foreign"] as const).map((o) => (
                  <button
                    key={o}
                    type="button"
                    onClick={() => setOrigin(o)}
                    className={`h-10 rounded-full text-[13px] font-medium transition-all cursor-pointer border ${
                      origin === o
                        ? "bg-[#FDF2EA] text-[#C85A17] border-[#F3DAC9] font-semibold shadow-2xs"
                        : "bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100"
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-3 text-[13px] text-rose-600 bg-rose-50 border border-rose-200/80 rounded-xl leading-relaxed">
                {error}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="relative overflow-hidden w-full h-11 bg-gradient-to-b from-[#FF7A45] via-[#FF6433] to-[#E84A23] border border-white/35 rounded-full font-medium text-[14px] text-white flex items-center justify-center gap-2 shadow-[inset_0_1.5px_1.5px_rgba(255,255,255,0.7),inset_0_-2px_4px_rgba(0,0,0,0.15),0_8px_20px_rgba(232,74,35,0.25)] hover:brightness-105 active:scale-[0.985] transition-all cursor-pointer"
              >
                <div className="absolute inset-x-2 top-0.5 h-[46%] bg-gradient-to-b from-white/70 via-white/20 to-transparent rounded-t-full pointer-events-none" />
                <span>Continue to Disciplines</span>
              </button>

              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleRegister(false)}
                className="w-full text-center text-[13px] font-medium text-slate-500 hover:text-slate-800 transition-colors py-2 cursor-pointer"
              >
                Skip for now &amp; go to dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── STEP 3: MODELING DISCIPLINES (SEPARATE UNCLUTTERED UI) ─── */}
      {step === 3 && (
        <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-1.5 text-[12px] font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <span className="text-[13px] font-semibold text-[#FF6433]">
              Step 3 of 3
            </span>
          </div>

          <div className="flex flex-col space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Modeling Disciplines</h1>
            <p className="text-[13px] text-slate-500">
              Select your specialties and casting genres. Choose all that apply.
            </p>
          </div>

          <div className="space-y-4 pt-1">
            {/* Disciplines Selection (Spacious, uncluttered, all rounded-full) */}
            <div className="flex flex-wrap gap-2 pt-1">
              {DISCIPLINES.map((item) => {
                const isSelected = selectedDisciplines.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleDiscipline(item)}
                    className={`px-4 py-2 rounded-full text-[13px] transition-all cursor-pointer border flex items-center gap-2 ${
                      isSelected
                        ? "bg-[#FDF2EA] text-[#C85A17] border-[#F3DAC9] font-semibold shadow-2xs"
                        : "bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100 font-medium"
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#C85A17]" />}
                    <span>{item}</span>
                  </button>
                );
              })}
            </div>

            {error && (
              <div className="p-3 text-[13px] text-rose-600 bg-rose-50 border border-rose-200/80 rounded-xl leading-relaxed">
                {error}
              </div>
            )}

            {/* Final Action Buttons */}
            <div className="space-y-2 pt-4">
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleRegister(true)}
                className="relative overflow-hidden w-full h-11 bg-gradient-to-b from-[#FF7A45] via-[#FF6433] to-[#E84A23] border border-white/35 rounded-full font-medium text-[14px] text-white flex items-center justify-center gap-2 shadow-[inset_0_1.5px_1.5px_rgba(255,255,255,0.7),inset_0_-2px_4px_rgba(0,0,0,0.15),0_8px_20px_rgba(232,74,35,0.25)] hover:brightness-105 active:scale-[0.985] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-x-2 top-0.5 h-[46%] bg-gradient-to-b from-white/70 via-white/20 to-transparent rounded-t-full pointer-events-none" />
                {isLoading && <Loader2 className="h-4 w-4 animate-spin text-white" />}
                <span>{isLoading ? "Setting up account..." : "Complete & Join"}</span>
              </button>

              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleRegister(false)}
                className="w-full text-center text-[13px] font-medium text-slate-500 hover:text-slate-800 transition-colors py-2 cursor-pointer"
              >
                Skip for now &amp; go to dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── NATIVE iOS 3-COLUMN SPINNING WHEEL DATE PICKER MODAL ─── */}
      <WheelDatePickerModal
        isOpen={isWheelPickerOpen}
        onClose={() => setIsWheelPickerOpen(false)}
        value={dateOfBirth}
        onConfirm={(date) => setDateOfBirth(date)}
        title="Date of Birth"
      />
    </>
  );
}
