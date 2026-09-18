"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  ChevronLeft,
  Loader2,
  Sparkles,
  Check,
  Coins,
  Clock,
  MapPin,
  Tag,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createGig } from "@/lib/api";

const PRESET_IMAGES = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800",
];

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  tag: z.string().min(2, "Tag is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  hourlyRateLkr: z.coerce.number().min(500, "Hourly rate must be at least 500 LKR"),
  durationHours: z.string().min(1, "Duration is required"),
  venueName: z.string().min(2, "Venue name is required"),
  highlightTitle: z.string().min(2, "Highlight title is required"),
  highlightSubtitle: z.string().min(2, "Highlight subtitle is required"),
  whatsIncluded: z.string().min(2, "Please provide at least one feature"),
  coverImageUrl: z.string().url("Must be a valid image URL").optional().or(z.literal("")),
});

export default function CreateGigPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      tag: "Fashion & Portfolio",
      description: "",
      hourlyRateLkr: 5000,
      durationHours: "2 Hours",
      venueName: "Studio A - Colombo",
      highlightTitle: "Studio Wardrobe",
      highlightSubtitle: "2 outfit changes included",
      whatsIncluded: "Professional Studio Lighting, Makeup Touch-ups, 10 High-Res Edits, All Raw Files",
      coverImageUrl: PRESET_IMAGES[0],
    },
  });

  const selectedCover = form.watch("coverImageUrl");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    try {
      const parsedValues = {
        ...values,
        whatsIncluded: values.whatsIncluded.split(",").map((i) => i.trim()).filter(Boolean),
        coverImageUrl: values.coverImageUrl || PRESET_IMAGES[0],
      };

      await createGig(parsedValues);
      router.push("/model/gigs");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to create gig");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col w-full overflow-hidden justify-between gap-3 sm:gap-4 min-h-0 select-none">
      {/* Upper Navigation Row in Dark Frame */}
      <div className="px-3 pt-2 pb-0.5 flex items-center justify-between shrink-0">
        <Link
          href="/model/gigs"
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-xs flex items-center justify-center text-white transition-all cursor-pointer"
          aria-label="Back to gigs"
        >
          <ChevronLeft className="w-5 h-5 -ml-0.5 text-white" />
        </Link>

        <div className="flex flex-col items-center">
          <span className="text-[15px] font-medium text-white tracking-tight">
            Create New Gig
          </span>
          <span className="text-[11px] font-medium text-white/60">
            Publish Casting Service
          </span>
        </div>

        <span className="px-3 py-1 bg-[#FF6433]/20 border border-[#FF6433]/40 text-[#FF8C6E] text-[12px] font-medium rounded-full">
          New Gig
        </span>
      </div>

      {/* Bottom Sheet Container: Light curved panel with notch */}
      <div className="flex-1 min-h-0 bg-[#DCE0E2] rounded-t-[36px] rounded-b px-4 pt-3 pb-8 flex flex-col gap-3.5 overflow-y-auto">
        {/* Drag Notch Indicator */}
        <div className="w-10 h-1 bg-slate-400/50 rounded-full mx-auto my-0.5 shrink-0" />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3.5">
            {/* Bento Card 1: Gig Overview */}
            <div className="bg-white rounded-[24px] p-4 sm:p-5 border border-black/5 shadow-xs flex flex-col gap-3.5">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 bg-[#FFF0EB] text-[#FF6433] text-[11px] font-medium rounded-full">
                  Overview
                </span>
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                  Basic Info
                </span>
              </div>

              <div className="flex flex-col gap-3">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[12px] font-medium text-slate-600">
                        Gig Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Editorial Fashion Shoot"
                          className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-medium text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#FF6433] focus-visible:border-[#FF6433] shadow-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px] text-red-500 font-medium" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tag"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[12px] font-medium text-slate-600 flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-slate-400" />
                        <span>Category Tag</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Fashion & Portfolio"
                          className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-medium text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#FF6433] focus-visible:border-[#FF6433] shadow-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px] text-red-500 font-medium" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[12px] font-medium text-slate-600">
                        Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the styling, mood, poses, and deliverables for this session..."
                          className="w-full min-h-[88px] p-3 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-medium text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#FF6433] focus-visible:border-[#FF6433] shadow-none resize-none leading-relaxed"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px] text-red-500 font-medium" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Bento Card 2: Pricing & Logistics */}
            <div className="bg-white rounded-[24px] p-4 sm:p-5 border border-black/5 shadow-xs flex flex-col gap-3.5">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 bg-[#FFF0EB] text-[#FF6433] text-[11px] font-medium rounded-full">
                  Logistics & Rate
                </span>
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                  Pricing
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <FormField
                  control={form.control}
                  name="hourlyRateLkr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[12px] font-medium text-slate-600 flex items-center gap-1.5">
                        <Coins className="w-3.5 h-3.5 text-slate-400" />
                        <span>Hourly Rate</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative flex items-center">
                          <Input
                            type="number"
                            placeholder="5000"
                            className="w-full h-11 pl-3 pr-14 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-medium text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#FF6433] focus-visible:border-[#FF6433] shadow-none"
                            {...field}
                          />
                          <span className="absolute right-3 text-[12px] font-medium text-slate-400 select-none">
                            LKR/hr
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage className="text-[11px] text-red-500 font-medium" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="durationHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[12px] font-medium text-slate-600 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Session Length</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. 2 Hours"
                          className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-medium text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#FF6433] focus-visible:border-[#FF6433] shadow-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px] text-red-500 font-medium" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="venueName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[12px] font-medium text-slate-600 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>Location / Venue</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Studio A"
                          className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-medium text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#FF6433] focus-visible:border-[#FF6433] shadow-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px] text-red-500 font-medium" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Bento Card 3: Visual Cover Photo */}
            <div className="bg-white rounded-[24px] p-4 sm:p-5 border border-black/5 shadow-xs flex flex-col gap-3.5">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 bg-[#FFF0EB] text-[#FF6433] text-[11px] font-medium rounded-full">
                  Cover Photo
                </span>
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                  Select Visual
                </span>
              </div>

              {/* Preset Gallery Picker */}
              <div className="grid grid-cols-4 gap-2.5">
                {PRESET_IMAGES.map((imgUrl, idx) => {
                  const isSelected = selectedCover === imgUrl;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => form.setValue("coverImageUrl", imgUrl)}
                      className={`relative aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        isSelected
                          ? "border-[#FF6433] ring-2 ring-[#FF6433]/30 scale-[1.02]"
                          : "border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-400"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imgUrl}
                        alt={`Preset ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <div className="w-5 h-5 rounded-full bg-[#FF6433] text-white flex items-center justify-center shadow-xs">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <FormField
                control={form.control}
                name="coverImageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] font-medium text-slate-500">
                      Or Custom Image URL
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://..."
                        className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-medium text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#FF6433] focus-visible:border-[#FF6433] shadow-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[11px] text-red-500 font-medium" />
                  </FormItem>
                )}
              />
            </div>

            {/* Bento Card 4: Highlight Callout */}
            <div className="bg-white rounded-[24px] p-4 sm:p-5 border border-black/5 shadow-xs flex flex-col gap-3.5">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 bg-[#FFF0EB] text-[#FF6433] text-[11px] font-medium rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#FF6433]" />
                  <span>Featured Callout</span>
                </span>
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                  Card Highlight
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="highlightTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[12px] font-medium text-slate-600">
                        Feature Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Studio Wardrobe"
                          className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-medium text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#FF6433] focus-visible:border-[#FF6433] shadow-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px] text-red-500 font-medium" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="highlightSubtitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[12px] font-medium text-slate-600">
                        Feature Subtitle
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. 2 outfit changes included"
                          className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-medium text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#FF6433] focus-visible:border-[#FF6433] shadow-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px] text-red-500 font-medium" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Bento Card 5: What's Included */}
            <div className="bg-white rounded-[24px] p-4 sm:p-5 border border-black/5 shadow-xs flex flex-col gap-3.5">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 bg-[#FFF0EB] text-[#FF6433] text-[11px] font-medium rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-[#FF6433]" />
                  <span>Deliverables</span>
                </span>
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                  Inclusions
                </span>
              </div>

              <FormField
                control={form.control}
                name="whatsIncluded"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[12px] font-medium text-slate-600">
                      Included Items (comma-separated)
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Studio Lighting, Hair & Makeup, 10 Retouched Edits, Full RAWs"
                        className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-medium text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#FF6433] focus-visible:border-[#FF6433] shadow-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[11px] text-red-500 font-medium" />
                  </FormItem>
                )}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-[13px] font-medium rounded-2xl">
                {error}
              </div>
            )}

            {/* Bottom Actions Bento Card */}
            <div className="bg-white rounded-[24px] p-4 border border-black/5 shadow-xs flex flex-col gap-2.5 mt-1">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-linear-to-b from-[#FF7A45] via-[#FF6433] to-[#E84A23] hover:from-[#FF8A55] hover:to-[#EA5A33] text-white text-[14px] font-medium rounded-full transition-all shadow-[inset_0_1.5px_1.5px_rgba(255,255,255,0.4),0_8px_20px_rgba(232,74,35,0.25)] active:scale-[0.98] cursor-pointer text-center disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Publishing Gig...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-white" />
                    <span>Publish Gig</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => router.push("/model/gigs")}
                disabled={isLoading}
                className="w-full h-11 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[13px] font-medium rounded-full transition-colors flex items-center justify-center cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
